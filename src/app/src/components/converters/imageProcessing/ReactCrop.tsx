import React, { PureComponent, createRef } from "react";

import { Ords, XYOrds, Crop, PixelCrop, PercentCrop } from "./types";
import {
  defaultCrop,
  clamp,
  cls,
  areCropsEqual,
  convertToPercentCrop,
  convertToPixelCrop,
  containCrop,
  nudgeCrop,
} from "./utils";

import "./ReactCrop.scss";

interface EVData {
  startClientX: number;
  startClientY: number;
  startCropX: number;
  startCropY: number;
  clientX: number;
  clientY: number;
  isResize: boolean;
  ord?: Ords;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DOC_MOVE_OPTS = { capture: true, passive: false };
let instanceCount = 0;

export interface ReactCropProps {
  ariaLabels?: {
    cropArea: string;
    nwDragHandle: string;
    nDragHandle: string;
    neDragHandle: string;
    eDragHandle: string;
    seDragHandle: string;
    sDragHandle: string;
    swDragHandle: string;
    wDragHandle: string;
  };
  aspect?: number;
  className?: string;
  children?: React.ReactNode;
  circularCrop?: boolean;
  crop?: Crop;
  disabled?: boolean;
  locked?: boolean;
  keepSelection?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onChange: (crop: PixelCrop, percentageCrop: PercentCrop) => void;
  onComplete?: (crop: PixelCrop, percentageCrop: PercentCrop) => void;
  onDragStart?: (e: PointerEvent) => void;
  onDragEnd?: (e: PointerEvent) => void;
  renderSelectionAddon?: (state: ReactCropState) => React.ReactNode;
  ruleOfThirds?: boolean;
  style?: React.CSSProperties;
}

export interface ReactCropState {
  cropIsActive: boolean;
  newCropIsBeingDrawn: boolean;
}

export class ReactCrop extends PureComponent<ReactCropProps, ReactCropState> {
  static xOrds = ["e", "w"];
  static yOrds = ["n", "s"];
  static xyOrds = ["nw", "ne", "se", "sw"];

  static nudgeStep = 1;
  static nudgeStepMedium = 10;
  static nudgeStepLarge = 100;

  static defaultProps = {
    ariaLabels: {
      cropArea: "Use the arrow keys to move the crop selection area",
      nwDragHandle:
        "Use the arrow keys to move the north west drag handle to change the crop selection area",
      nDragHandle:
        "Use the up and down arrow keys to move the north drag handle to change the crop selection area",
      neDragHandle:
        "Use the arrow keys to move the north east drag handle to change the crop selection area",
      eDragHandle:
        "Use the up and down arrow keys to move the east drag handle to change the crop selection area",
      seDragHandle:
        "Use the arrow keys to move the south east drag handle to change the crop selection area",
      sDragHandle:
        "Use the up and down arrow keys to move the south drag handle to change the crop selection area",
      swDragHandle:
        "Use the arrow keys to move the south west drag handle to change the crop selection area",
      wDragHandle:
        "Use the up and down arrow keys to move the west drag handle to change the crop selection area",
    },
  };

  get document() {
    return document;
  }

  docMoveBound = false;
  mouseDownOnCrop = false;
  dragStarted = false;
  evData: EVData = {
    startClientX: 0,
    startClientY: 0,
    startCropX: 0,
    startCropY: 0,
    clientX: 0,
    clientY: 0,
    isResize: true,
  };

  componentRef = createRef<HTMLDivElement>();
  mediaRef = createRef<HTMLDivElement>();
  resizeObserver?: ResizeObserver;
  initChangeCalled = false;
  instanceId = `rc-${instanceCount++}`;

  state: ReactCropState = {
    cropIsActive: false,
    newCropIsBeingDrawn: false,
  };

  getBox(): Rectangle {
    const el = this.mediaRef.current;
    if (!el) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    const { x, y, width, height } = el.getBoundingClientRect();
    return { x, y, width, height };
  }

  componentDidUpdate(prevProps: ReactCropProps) {
    const { crop, onComplete } = this.props;

    if (onComplete && !prevProps.crop && crop) {
      const { width, height } = this.getBox();
      if (width && height) {
        onComplete(
          convertToPixelCrop(crop, width, height),
          convertToPercentCrop(crop, width, height)
        );
      }
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  bindDocMove() {
    if (this.docMoveBound) {
      return;
    }

    this.document.addEventListener(
      "pointermove",
      this.onDocPointerMove,
      DOC_MOVE_OPTS
    );
    this.document.addEventListener(
      "pointerup",
      this.onDocPointerDone,
      DOC_MOVE_OPTS
    );
    this.document.addEventListener(
      "pointercancel",
      this.onDocPointerDone,
      DOC_MOVE_OPTS
    );

    this.docMoveBound = true;
  }

  unbindDocMove() {
    if (!this.docMoveBound) {
      return;
    }

    this.document.removeEventListener(
      "pointermove",
      this.onDocPointerMove,
      DOC_MOVE_OPTS
    );
    this.document.removeEventListener(
      "pointerup",
      this.onDocPointerDone,
      DOC_MOVE_OPTS
    );
    this.document.removeEventListener(
      "pointercancel",
      this.onDocPointerDone,
      DOC_MOVE_OPTS
    );

    this.docMoveBound = false;
  }

  onCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { crop, disabled } = this.props;
    const box = this.getBox();

    if (!crop) {
      return;
    }

    const pixelCrop = convertToPixelCrop(crop, box.width, box.height);

    if (disabled) {
      return;
    }

    if (e.cancelable) e.preventDefault(); // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    this.bindDocMove();

    // Focus for detecting keypress.
    (this.componentRef.current as HTMLDivElement).focus({
      preventScroll: true,
    });

    const ord = (e.target as HTMLElement).dataset.ord as Ords;
    const isResize = Boolean(ord);
    let startClientX = e.clientX;
    let startClientY = e.clientY;
    let startCropX = pixelCrop.x;
    let startCropY = pixelCrop.y;

    // Set the starting coords to the opposite corner.
    if (ord) {
      const relativeX = e.clientX - box.x;
      const relativeY = e.clientY - box.y;
      let fromCornerX = 0;
      let fromCornerY = 0;

      if (ord === "ne" || ord == "e") {
        fromCornerX = relativeX - (pixelCrop.x + pixelCrop.width);
        fromCornerY = relativeY - pixelCrop.y;
        startCropX = pixelCrop.x;
        startCropY = pixelCrop.y + pixelCrop.height;
      } else if (ord === "se" || ord === "s") {
        fromCornerX = relativeX - (pixelCrop.x + pixelCrop.width);
        fromCornerY = relativeY - (pixelCrop.y + pixelCrop.height);
        startCropX = pixelCrop.x;
        startCropY = pixelCrop.y;
      } else if (ord === "sw" || ord == "w") {
        fromCornerX = relativeX - pixelCrop.x;
        fromCornerY = relativeY - (pixelCrop.y + pixelCrop.height);
        startCropX = pixelCrop.x + pixelCrop.width;
        startCropY = pixelCrop.y;
      } else if (ord === "nw" || ord == "n") {
        fromCornerX = relativeX - pixelCrop.x;
        fromCornerY = relativeY - pixelCrop.y;
        startCropX = pixelCrop.x + pixelCrop.width;
        startCropY = pixelCrop.y + pixelCrop.height;
      }

      startClientX = startCropX + box.x + fromCornerX;
      startClientY = startCropY + box.y + fromCornerY;
    }

    this.evData = {
      startClientX,
      startClientY,
      startCropX,
      startCropY,
      clientX: e.clientX,
      clientY: e.clientY,
      isResize,
      ord,
    };

    this.mouseDownOnCrop = true;
    this.setState({ cropIsActive: true });
  };

  onComponentPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { crop, disabled, locked, keepSelection, onChange } = this.props;
    const box = this.getBox();

    if (disabled || locked || (keepSelection && crop)) {
      return;
    }

    if (e.cancelable) e.preventDefault(); // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    this.bindDocMove();

    // Focus for detecting keypress.
    (this.componentRef.current as HTMLDivElement).focus({
      preventScroll: true,
    });

    const cropX = e.clientX - box.x;
    const cropY = e.clientY - box.y;
    const nextCrop: PixelCrop = {
      unit: "px",
      x: cropX,
      y: cropY,
      width: 0,
      height: 0,
    };

    this.evData = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startCropX: cropX,
      startCropY: cropY,
      clientX: e.clientX,
      clientY: e.clientY,
      isResize: true,
    };

    this.mouseDownOnCrop = true;

    onChange(
      convertToPixelCrop(nextCrop, box.width, box.height),
      convertToPercentCrop(nextCrop, box.width, box.height)
    );

    this.setState({ cropIsActive: true, newCropIsBeingDrawn: true });
  };

  onDocPointerMove = (e: PointerEvent) => {
    const { crop, disabled, onChange, onDragStart } = this.props;
    const box = this.getBox();

    if (disabled || !crop || !this.mouseDownOnCrop) {
      return;
    }

    // Stop drag selection.
    if (e.cancelable) e.preventDefault();

    if (!this.dragStarted) {
      this.dragStarted = true;
      if (onDragStart) {
        onDragStart(e);
      }
    }

    // Update pointer position.
    const { evData } = this;

    evData.clientX = e.clientX;
    evData.clientY = e.clientY;

    let nextCrop;

    if (evData.isResize) {
      nextCrop = this.resizeCrop();
    } else {
      nextCrop = this.dragCrop();
    }

    if (!areCropsEqual(crop, nextCrop)) {
      onChange(
        convertToPixelCrop(nextCrop, box.width, box.height),
        convertToPercentCrop(nextCrop, box.width, box.height)
      );
    }
  };

  onComponentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { crop, disabled, onChange, onComplete } = this.props;

    if (disabled) {
      return;
    }

    const keyCode = e.key;
    let nudged = false;

    if (!crop) {
      return;
    }

    const box = this.getBox();
    const nextCrop = this.makePixelCrop(box);
    const ctrlCmdPressed = navigator.platform.match("Mac")
      ? e.metaKey
      : e.ctrlKey;
    const nudgeStep = ctrlCmdPressed
      ? ReactCrop.nudgeStepLarge
      : e.shiftKey
        ? ReactCrop.nudgeStepMedium
        : ReactCrop.nudgeStep;

    if (keyCode === "ArrowLeft") {
      nextCrop.x -= nudgeStep;
      nudged = true;
    } else if (keyCode === "ArrowRight") {
      nextCrop.x += nudgeStep;
      nudged = true;
    } else if (keyCode === "ArrowUp") {
      nextCrop.y -= nudgeStep;
      nudged = true;
    } else if (keyCode === "ArrowDown") {
      nextCrop.y += nudgeStep;
      nudged = true;
    }

    if (nudged) {
      if (e.cancelable) e.preventDefault(); // Stop drag selection.

      nextCrop.x = clamp(nextCrop.x, 0, box.width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, box.height - nextCrop.height);

      const pixelCrop = convertToPixelCrop(nextCrop, box.width, box.height);
      const percentCrop = convertToPercentCrop(nextCrop, box.width, box.height);

      onChange(pixelCrop, percentCrop);
      if (onComplete) {
        onComplete(pixelCrop, percentCrop);
      }
    }
  };

  onHandlerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, ord: Ords) => {
    const {
      aspect = 0,
      crop,
      disabled,
      minWidth = 0,
      minHeight = 0,
      maxWidth,
      maxHeight,
      onChange,
      onComplete,
    } = this.props;
    const box = this.getBox();

    if (disabled || !crop) {
      return;
    }

    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      return;
    }

    const ctrlCmdPressed = navigator.platform.match("Mac")
      ? e.metaKey
      : e.ctrlKey;
    const offset = ctrlCmdPressed
      ? ReactCrop.nudgeStepLarge
      : e.shiftKey
        ? ReactCrop.nudgeStepMedium
        : ReactCrop.nudgeStep;

    const pixelCrop = convertToPixelCrop(crop, box.width, box.height);
    const nudgedCrop = nudgeCrop(pixelCrop, e.key, offset, ord);
    const containedCrop = containCrop(
      nudgedCrop,
      aspect,
      ord,
      box.width,
      box.height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    );

    if (!areCropsEqual(crop, containedCrop)) {
      const percentCrop = convertToPercentCrop(
        containedCrop,
        box.width,
        box.height
      );
      onChange(containedCrop, percentCrop);

      if (onComplete) {
        onComplete(containedCrop, percentCrop);
      }
    }
  };

  onDocPointerDone = (e: PointerEvent) => {
    const { crop, disabled, onComplete, onDragEnd } = this.props;
    const box = this.getBox();

    this.unbindDocMove();

    if (disabled || !crop) {
      return;
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false;
      this.dragStarted = false;

      onDragEnd && onDragEnd(e);
      onComplete &&
        onComplete(
          convertToPixelCrop(crop, box.width, box.height),
          convertToPercentCrop(crop, box.width, box.height)
        );

      this.setState({ cropIsActive: false, newCropIsBeingDrawn: false });
    }
  };

  onDragFocus = (/*e: React.FocusEvent<HTMLDivElement, Element>*/) => {
    // Fixes #491
    this.componentRef.current?.scrollTo(0, 0);
  };

  getCropStyle() {
    const { crop } = this.props;

    if (!crop) {
      return undefined;
    }

    return {
      top: `${crop.y}${crop.unit}`,
      left: `${crop.x}${crop.unit}`,
      width: `${crop.width}${crop.unit}`,
      height: `${crop.height}${crop.unit}`,
    };
  }

  dragCrop() {
    const { evData } = this;
    const box = this.getBox();
    const nextCrop = this.makePixelCrop(box);
    const xDiff = evData.clientX - evData.startClientX;
    const yDiff = evData.clientY - evData.startClientY;

    nextCrop.x = clamp(
      evData.startCropX + xDiff,
      0,
      box.width - nextCrop.width
    );
    nextCrop.y = clamp(
      evData.startCropY + yDiff,
      0,
      box.height - nextCrop.height
    );

    return nextCrop;
  }

  getPointRegion(
    box: Rectangle,
    origOrd: Ords | undefined,
    minWidth: number,
    minHeight: number
  ): XYOrds {
    const { evData } = this;

    const relativeX = evData.clientX - box.x;
    const relativeY = evData.clientY - box.y;

    let topHalf: boolean;
    if (minHeight && origOrd) {
      topHalf = origOrd === "nw" || origOrd === "n" || origOrd === "ne";
    } else {
      topHalf = relativeY < evData.startCropY;
    }

    let leftHalf: boolean;
    if (minWidth && origOrd) {
      leftHalf = origOrd === "nw" || origOrd === "w" || origOrd === "sw";
    } else {
      leftHalf = relativeX < evData.startCropX;
    }

    if (leftHalf) {
      return topHalf ? "nw" : "sw";
    } else {
      return topHalf ? "ne" : "se";
    }
  }

  resolveMinDimensions(
    box: Rectangle,
    aspect: number,
    minWidth = 0,
    minHeight = 0
  ) {
    const mw = Math.min(minWidth, box.width);
    const mh = Math.min(minHeight, box.height);

    if (!aspect || (!mw && !mh)) {
      return [mw, mh];
    }

    if (aspect > 1) {
      return mw ? [mw, mw / aspect] : [mh * aspect, mh];
    } else {
      return mh ? [mh * aspect, mh] : [mw, mw / aspect];
    }
  }

  resizeCrop() {
    const { evData } = this;
    const { aspect = 0, maxWidth, maxHeight } = this.props;
    const box = this.getBox();
    const [minWidth, minHeight] = this.resolveMinDimensions(
      box,
      aspect,
      this.props.minWidth,
      this.props.minHeight
    );
    let nextCrop = this.makePixelCrop(box);
    const area = this.getPointRegion(box, evData.ord, minWidth, minHeight);
    const ord = evData.ord || area;
    let xDiff = evData.clientX - evData.startClientX;
    let yDiff = evData.clientY - evData.startClientY;

    if ((minWidth && ord === "nw") || ord === "w" || ord === "sw") {
      xDiff = Math.min(xDiff, -minWidth);
    }

    if ((minHeight && ord === "nw") || ord === "n" || ord === "ne") {
      yDiff = Math.min(yDiff, -minHeight);
    }

    const tmpCrop: PixelCrop = {
      unit: "px",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    if (area === "ne") {
      tmpCrop.x = evData.startCropX;
      tmpCrop.width = xDiff;

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
        tmpCrop.y = evData.startCropY - tmpCrop.height;
      } else {
        tmpCrop.height = Math.abs(yDiff);
        tmpCrop.y = evData.startCropY - tmpCrop.height;
      }
    } else if (area === "se") {
      tmpCrop.x = evData.startCropX;
      tmpCrop.y = evData.startCropY;
      tmpCrop.width = xDiff;

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
      } else {
        tmpCrop.height = yDiff;
      }
    } else if (area === "sw") {
      tmpCrop.x = evData.startCropX + xDiff;
      tmpCrop.y = evData.startCropY;
      tmpCrop.width = Math.abs(xDiff);

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
      } else {
        tmpCrop.height = yDiff;
      }
    } else if (area === "nw") {
      tmpCrop.x = evData.startCropX + xDiff;
      tmpCrop.width = Math.abs(xDiff);

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
        tmpCrop.y = evData.startCropY - tmpCrop.height;
      } else {
        tmpCrop.height = Math.abs(yDiff);
        tmpCrop.y = evData.startCropY + yDiff;
      }
    }

    const containedCrop = containCrop(
      tmpCrop,
      aspect,
      area,
      box.width,
      box.height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    );

    if (aspect || ReactCrop.xyOrds.indexOf(ord) > -1) {
      nextCrop = containedCrop;
    } else if (ReactCrop.xOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.width = containedCrop.width;
    } else if (ReactCrop.yOrds.indexOf(ord) > -1) {
      nextCrop.y = containedCrop.y;
      nextCrop.height = containedCrop.height;
    }

    nextCrop.x = clamp(nextCrop.x, 0, box.width - nextCrop.width);
    nextCrop.y = clamp(nextCrop.y, 0, box.height - nextCrop.height);

    return nextCrop;
  }

  renderCropSelection() {
    const {
      ariaLabels = ReactCrop.defaultProps.ariaLabels,
      disabled,
      locked,
      renderSelectionAddon,
      ruleOfThirds,
      crop,
    } = this.props;
    const style = this.getCropStyle();

    if (!crop) {
      return undefined;
    }

    return (
      <div
        style={style}
        className="ReactCrop__crop-selection"
        onPointerDown={this.onCropPointerDown}
        aria-label={ariaLabels.cropArea}
        tabIndex={0}
        onKeyDown={this.onComponentKeyDown}
        role="group"
      >
        {!disabled && !locked && (
          <div className="ReactCrop__drag-elements" onFocus={this.onDragFocus}>
            <div className="ReactCrop__drag-bar ord-n" data-ord="n" />
            <div className="ReactCrop__drag-bar ord-e" data-ord="e" />
            <div className="ReactCrop__drag-bar ord-s" data-ord="s" />
            <div className="ReactCrop__drag-bar ord-w" data-ord="w" />

            <div
              className="ReactCrop__drag-handle ord-nw"
              data-ord="nw"
              tabIndex={0}
              aria-label={ariaLabels.nwDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "nw")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-n"
              data-ord="n"
              tabIndex={0}
              aria-label={ariaLabels.nDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "n")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-ne"
              data-ord="ne"
              tabIndex={0}
              aria-label={ariaLabels.neDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "ne")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-e"
              data-ord="e"
              tabIndex={0}
              aria-label={ariaLabels.eDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "e")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-se"
              data-ord="se"
              tabIndex={0}
              aria-label={ariaLabels.seDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "se")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-s"
              data-ord="s"
              tabIndex={0}
              aria-label={ariaLabels.sDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "s")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-sw"
              data-ord="sw"
              tabIndex={0}
              aria-label={ariaLabels.swDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "sw")}
              role="button"
            />
            <div
              className="ReactCrop__drag-handle ord-w"
              data-ord="w"
              tabIndex={0}
              aria-label={ariaLabels.wDragHandle}
              onKeyDown={(e) => this.onHandlerKeyDown(e, "w")}
              role="button"
            />
          </div>
        )}
        {renderSelectionAddon && (
          <div
            className="ReactCrop__selection-addon"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {renderSelectionAddon(this.state)}
          </div>
        )}
        {ruleOfThirds && (
          <>
            <div className="ReactCrop__rule-of-thirds-hz" />
            <div className="ReactCrop__rule-of-thirds-vt" />
          </>
        )}
      </div>
    );
  }

  makePixelCrop(box: Rectangle) {
    const crop = { ...defaultCrop, ...(this.props.crop || {}) };
    return convertToPixelCrop(crop, box.width, box.height);
  }

  render() {
    const {
      aspect,
      children,
      circularCrop,
      className,
      crop,
      disabled,
      locked,
      style,
      ruleOfThirds,
    } = this.props;
    const { cropIsActive, newCropIsBeingDrawn } = this.state;
    const cropSelection = crop ? this.renderCropSelection() : null;

    const componentClasses = cls(
      "ReactCrop",
      className,
      cropIsActive && "ReactCrop--active",
      disabled && "ReactCrop--disabled",
      locked && "ReactCrop--locked",
      newCropIsBeingDrawn && "ReactCrop--new-crop",
      crop && aspect && "ReactCrop--fixed-aspect",
      crop && circularCrop && "ReactCrop--circular-crop",
      crop && ruleOfThirds && "ReactCrop--rule-of-thirds",
      !this.dragStarted &&
        crop &&
        !crop.width &&
        !crop.height &&
        "ReactCrop--invisible-crop",
      circularCrop && "ReactCrop--no-animate"
    );

    return (
      <div ref={this.componentRef} className={componentClasses} style={style}>
        <div
          ref={this.mediaRef}
          className="ReactCrop__child-wrapper"
          onPointerDown={this.onComponentPointerDown}
        >
          {children}
        </div>
        {crop ? (
          <svg className="ReactCrop__crop-mask" width="100%" height="100%">
            <defs>
              <mask id={`hole-${this.instanceId}`}>
                <rect width="100%" height="100%" fill="white" />
                {circularCrop ? (
                  <ellipse
                    cx={`${crop.x + crop.width / 2}${crop.unit}`}
                    cy={`${crop.y + crop.height / 2}${crop.unit}`}
                    rx={`${crop.width / 2}${crop.unit}`}
                    ry={`${crop.height / 2}${crop.unit}`}
                    fill="black"
                  />
                ) : (
                  <rect
                    x={`${crop.x}${crop.unit}`}
                    y={`${crop.y}${crop.unit}`}
                    width={`${crop.width}${crop.unit}`}
                    height={`${crop.height}${crop.unit}`}
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              fill="black"
              fillOpacity={0.5}
              width="100%"
              height="100%"
              mask={`url(#hole-${this.instanceId})`}
            />
          </svg>
        ) : undefined}
        {cropSelection}
      </div>
    );
  }
}
