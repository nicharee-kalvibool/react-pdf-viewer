export * from "./PDFViewer";

export default function PDFViewer<PDFViewerProps>(
    props: {
        src: string | Buffer;
    }
): JSX.Element;
