import * as PDFJS from "pdfjs-dist";
// @ts-ignore
import { WorkerMessageHandler } from "pdfjs-dist/build/pdf.worker.mjs";
import { GetViewportParameters, RenderParameters } from "pdfjs-dist/types/src/display/api";
import { useEffect, useMemo, useState } from "react";
PDFJS.GlobalWorkerOptions.workerSrc = WorkerMessageHandler;

type PDFRendererProps = {
    id: string;
    src: string | ArrayBuffer;
    defaultPage?: number;
    viewport?: GetViewportParameters;
};

type PDFWorkingProps = {
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

const DefaultParams: GetViewportParameters = {
    dontFlip: false,
    rotation: 0,
    scale: 5,
};

type ZoomScaleItemProps = { text: string; size: number };

type ZoomScaleProps = {
    [n: number]: ZoomScaleItemProps;
};

export const ZOOM_SCALE: ZoomScaleProps = {
    [0]: { text: "50%", size: 0.5 },
    [1]: { text: "75%", size: 0.75 },
    [2]: { text: "90%", size: 0.9 },
    [3]: { text: "100%", size: 1 },
    [4]: { text: "125%", size: 1.25 },
    [5]: { text: "150%", size: 1.5 },
};

const useRenderPDF = ({ id, src, defaultPage = 1, viewport = DefaultParams }: PDFRendererProps): PDFWorkingProps => {
    const [is_loading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState({});
    const [total_pages, setTotalPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(3);
    const [active_page, setActivePage] = useState(defaultPage);
    // const [file_name, setFileName] = useState<string>("");

    const render: () => Promise<void> = (): Promise<void> => {
        return new Promise(async (resolve, rejecte) => {
            setIsLoading(true);
            try {
                const pdf = await PDFJS.getDocument(src).promise;

                // Load information from the first page.
                const page = await pdf.getPage(active_page);
                const viewports = page.getViewport(viewport);

                // Apply page dimensions to the `<canvas>` element.
                const unscaledViewport = page.getViewport({ scale: 1 });

                const canvas = document.getElementById(id) as HTMLCanvasElement;
                const context = canvas.getContext("2d");
                if (context) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.beginPath();
                }
                // context.scale(ZOOM_SCALE[scale].size, ZOOM_SCALE[scale].size);
                // canvas.height = viewports.height;
                // canvas.width = viewports.width;

                canvas.height = viewports.height * ZOOM_SCALE[scale].size;
                canvas.width = viewports.width * ZOOM_SCALE[scale].size;
                canvas.style.height = `${unscaledViewport.height * ZOOM_SCALE[scale].size}px`;
                canvas.style.width = `${unscaledViewport.width * ZOOM_SCALE[scale].size}px`;

                // Render the page into the `<canvas>` element.
                const renderContext: RenderParameters = {
                    canvasContext: context,
                    viewport: viewports,
                    transform: [ZOOM_SCALE[scale].size, 0, 0, ZOOM_SCALE[scale].size, 0, 0],
                };
                page.render(renderContext);
                setTotalPages(pdf.numPages);
                setIsLoading(false);
                resolve();
            } catch (error) {
                setIsLoading(false);
                setErrors(error);
                // console.log(error);
                rejecte();
            }
        });
    };

    const handleChangePage = (page: number): void => {
        setActivePage(page);
    };

    const handleNextPage = (): void => {
        if (total_pages > active_page) {
            handleChangePage(active_page + 1);
        }
    };

    const handlePreviousPage = (): void => {
        if (active_page > 1) {
            handleChangePage(active_page - 1);
        }
    };

    const handleZoomIn = (): void => {
        if (scale < 5) {
            setScale(scale + 1);
        }
    };

    const handleZoomOut = (): void => {
        if (scale > 0) {
            setScale(scale - 1);
        }
    };

    return {
        isLoading: is_loading,
        errors: errors,
        totalPages: total_pages,
        activePage: active_page,
        scale: scale,
        render: render,
        onUpdateActivePage: handleChangePage,
        nextPage: handleNextPage,
        previousPage: handlePreviousPage,
        zoomIn: handleZoomIn,
        zoomOut: handleZoomOut,
    };
};

export default useRenderPDF;
