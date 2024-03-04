import React from "react";
import "./CustomComponent.scss";
interface CustomComponent {
    id: string;
    label: string;
    type: string;
    placement: string;
    code?: string;
}
declare const CustomComponent: React.FC;
export default CustomComponent;
