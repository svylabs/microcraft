import { useEffect, useContext } from "react";
import { GeneralContext } from "./GeneralContextProvider";

const Popup = () => {
    const {popup, setPopup} = useContext(GeneralContext);

    useEffect(() => {
        let timer = setTimeout(() => {
            setPopup(() => { return {show: false, message: "", timeout: 0}});
        }, popup.timeout*1000);

        return () => {
            clearTimeout(timer);
        };

    }, [popup.show, popup.message]);

    return (
        <div className="popup_container -ml-4 xl:-ml-32">
            <div className="popup" style={{borderBottom: "5px solid #24d654"}}>{popup.message}</div>
        </div>
    );
};

export default Popup;