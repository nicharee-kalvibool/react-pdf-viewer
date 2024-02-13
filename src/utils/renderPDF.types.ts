import { GetViewportParameters } from "pdfjs-dist/types/src/display/api";

export type PDFRendererProps = {
    id: string;
    src: string;
    defaultPage?: number;
    viewport?: GetViewportParameters;
};

export type PDFWorkingProps = {
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

export type ZoomScaleItemProps = { text: string; size: number };

export type ZoomScaleProps = {
    [n: number]: ZoomScaleItemProps;
};
