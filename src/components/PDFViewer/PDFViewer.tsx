import { useEffect, useState } from "react";
import styles from "./PDFViewer.module.scss";
import { isMobile } from "react-device-detect";
import useRenderPDF from "../../utils/renderPDF";

export interface PDFViewerProps {
    src: string;
}
const regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;

const PDFViewer = ({ src }: PDFViewerProps) => {
    const [page_number, setPageNumber] = useState(1);
    const { isLoading, errors, render } = useRenderPDF({
        src,
        id: "pdf",
        viewport: {
            scale: 1,
            dontFlip: true,
            rotation: 0,
        },
        page_number: page_number,
    });

    const handleRenderPDF = async () => {
        await render();
    };

    useEffect(() => {
        // if (src && !regex.test(src) && isMobile) {
        handleRenderPDF();
        // }
    }, [src, page_number]);

    return (
        <div className={styles.container}>
            {/* {!isMobile ? (
                <iframe
                    src={src}
                    title="PDF Viewer"
                />
            ) : ( */}
            <div className={styles.canvasContainer}>
                <div className={styles.canvasBox}>
                    <canvas id="pdf" />
                </div>
            </div>
            {/* )} */}
        </div>
    );
};

export default PDFViewer;
