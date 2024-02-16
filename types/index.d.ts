import { type PdfViewerProps, default as PdfViewer } from "./components";
import type { PDFRendererProps, PDFWorkingProps, ZoomScaleItemProps, ZoomScaleProps } from "./utils/renderPDF.types";

declare module "@ogs-ltd/react-pdf-viewer" {
    export { type PdfViewerProps, type PDFRendererProps, type PDFWorkingProps, type ZoomScaleItemProps, type ZoomScaleProps, PdfViewer };
}
