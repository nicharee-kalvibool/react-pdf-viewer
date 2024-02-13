import { PDFRendererProps, PDFWorkingProps, ZoomScaleProps } from "./renderPDF.types";
export declare const ZOOM_SCALE: ZoomScaleProps;
declare const useRenderPDF: ({ id, src, defaultPage, viewport }: PDFRendererProps) => PDFWorkingProps;
export default useRenderPDF;
