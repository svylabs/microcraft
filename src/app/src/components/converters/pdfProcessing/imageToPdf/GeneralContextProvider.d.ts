import React from 'react';

interface GeneralContextProviderProps {
    children?: React.ReactNode;
}

declare module './converters/pdfProcessing/imageToPdf/GeneralContextProvider' {
    const GeneralContextProvider: React.FC<GeneralContextProviderProps>;
    export default GeneralContextProvider;
}
