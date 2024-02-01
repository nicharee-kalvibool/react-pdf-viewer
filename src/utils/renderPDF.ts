import * as PDFJS from "pdfjs-dist";
// @ts-ignore
import { WorkerMessageHandler } from "pdfjs-dist/build/pdf.worker.mjs";
import { GetViewportParameters } from "pdfjs-dist/types/src/display/api";
import { useEffect, useMemo, useState } from "react";
PDFJS.GlobalWorkerOptions.workerSrc = WorkerMessageHandler;

type PDFRendererProps = {
    id: string;
    src: string | ArrayBuffer;
    page_number: number;
    viewport: GetViewportParameters;
};

type PDFWorkingProps = {
    isLoading: boolean;
    errors: object;
    render: () => Promise<void>;
};

const useRenderPDF = (params: PDFRendererProps): PDFWorkingProps => {
    const { src = "", page_number = 1, viewport, id } = params;

    const [is_loading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState({});

    const render: () => Promise<void> = (): Promise<void> => {
        return new Promise(async (resolve, rejecte) => {
            setIsLoading(true);
            try {
                const loadingTask = PDFJS.getDocument(src);
                const pdf = await loadingTask.promise;

                // Load information from the first page.
                const page = await pdf.getPage(page_number);
                const viewports = page.getViewport({ ...viewport, dontFlip: true, rotation: viewport.rotation || 0 });

                // Apply page dimensions to the `<canvas>` element.
                const canvas = document.getElementById(id) as HTMLCanvasElement;
                const context = canvas.getContext("2d");
                canvas.height = viewports.height;
                canvas.width = viewports.width;

                // Render the page into the `<canvas>` element.
                const renderContext = {
                    canvasContext: context,
                    viewport: viewports,
                };
                page.render(renderContext);
                setIsLoading(false);
                resolve();
            } catch (error) {
                // console.log(JSON.stringify(error));
                setIsLoading(false);
                setErrors(error);
                rejecte();
            }
        });
    };

    return {
        isLoading: is_loading,
        errors: errors,
        render: render,
    };
};

export default useRenderPDF;
