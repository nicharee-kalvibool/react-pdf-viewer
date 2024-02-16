import * as react_jsx_runtime from "react/jsx-runtime";
import { GetViewportParameters } from "pdfjs-dist/types/src/display/api";

type PdfViewerProps = {
    src: string;
};

declare const PDFViewer: ({ src }: PdfViewerProps) => react_jsx_runtime.JSX.Element;

type PDFRendererProps = {
    id: string;
    src: string;
    defaultPage?: number;
    viewport?: GetViewportParameters;
};
type PDFWorkingProps = {
    filename: string;
    isLoading: boolean;
    errors: object;
    totalPages: number;
    activePage: number;
    scale: number;
    render: () => Promise<void>;
    onUpdateActivePage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
};
type ZoomScaleItemProps = {
    text: string;
    size: number;
};
type ZoomScaleProps = {
    [n: number]: ZoomScaleItemProps;
};
declare module "@ogs/react-pdf-viewer" {
    export {
        type PDFRendererProps,
        type PDFWorkingProps,
        type PdfViewerProps,
        type ZoomScaleItemProps,
        type ZoomScaleProps,
        PDFViewer as default,
    };
}
