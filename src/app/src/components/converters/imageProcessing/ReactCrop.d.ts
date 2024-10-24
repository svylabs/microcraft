import React, { PureComponent } from "react";
import { Ords, XYOrds, Crop, PixelCrop, PercentCrop } from "./types";
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
export declare class ReactCrop extends PureComponent<ReactCropProps, ReactCropState> {
    static xOrds: string[];
    static yOrds: string[];
    static xyOrds: string[];
    static nudgeStep: number;
    static nudgeStepMedium: number;
    static nudgeStepLarge: number;
    static defaultProps: {
        ariaLabels: {
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
    };
    get document(): Document;
    docMoveBound: boolean;
    mouseDownOnCrop: boolean;
    dragStarted: boolean;
    evData: EVData;
    componentRef: React.RefObject<HTMLDivElement>;
    mediaRef: React.RefObject<HTMLDivElement>;
    resizeObserver?: ResizeObserver;
    initChangeCalled: boolean;
    instanceId: string;
    state: ReactCropState;
    getBox(): Rectangle;
    componentDidUpdate(prevProps: ReactCropProps): void;
    componentWillUnmount(): void;
    bindDocMove(): void;
    unbindDocMove(): void;
    onCropPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onComponentPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onDocPointerMove: (e: PointerEvent) => void;
    onComponentKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onHandlerKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, ord: Ords) => void;
    onDocPointerDone: (e: PointerEvent) => void;
    onDragFocus: () => void;
    getCropStyle(): {
        top: string;
        left: string;
        width: string;
        height: string;
    } | undefined;
    dragCrop(): PixelCrop;
    getPointRegion(box: Rectangle, origOrd: Ords | undefined, minWidth: number, minHeight: number): XYOrds;
    resolveMinDimensions(box: Rectangle, aspect: number, minWidth?: number, minHeight?: number): number[];
    resizeCrop(): PixelCrop;
    renderCropSelection(): import("react/jsx-runtime").JSX.Element | undefined;
    makePixelCrop(box: Rectangle): PixelCrop;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};
