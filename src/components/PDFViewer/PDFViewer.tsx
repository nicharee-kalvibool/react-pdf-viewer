import { useEffect } from "react";
import styles from "./PDFViewer.module.scss";
import { isMobile, isTablet } from "react-device-detect";
import useRenderPDF, { ZOOM_SCALE } from "../../utils/renderPDF";
import { ChevronLeft, ChevronRight, Download, Loader, MinusCircle, PlusCircle, ZoomIn, ZoomOut } from "react-feather";
import classNames from "classnames";

export interface PDFViewerProps {
    src: string;
}
const regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;

const PDFViewer = ({ src }: PDFViewerProps) => {
    const { isLoading, totalPages, render, activePage, nextPage, previousPage, zoomIn, zoomOut, scale } = useRenderPDF({
        src,
        id: "pdf",
    });

    // const handleRenderPDF = async () => {
    //     await render();
    // };

    const handleReRenderPDF = async () => {
        if (src && !regex.test(src)) {
            await render();
        }
    };

    useEffect(() => {
        handleReRenderPDF();
    }, [activePage, scale]);

    const handleNextPage = () => {
        nextPage();
    };

    const handlePreviousPage = () => {
        previousPage();
    };

    return (
        <div className={styles.container}>
            {/* {!isMobile && !isTablet ? (
            // {isMobile && isTablet ? (
                <iframe
                    src={src}
                    title="PDF Viewer"
                />
            ) : ( */}
            <div className={styles.canvasContainer}>
                <div className={styles.topBar}>
                    <div className={styles.leftSection}></div>
                    <div className={styles.certerSection}>
                        <div
                            className={classNames(styles.actionBtn, { [styles.disabled]: activePage <= 1 })}
                            onClick={() => handlePreviousPage()}
                        >
                            <ChevronLeft
                                size={16}
                                className={styles.icon}
                            />
                        </div>
                        <span className={classNames(styles.white, styles.pageInfo)}>
                            {isLoading ? (
                                "calculating"
                            ) : (
                                <>
                                    {activePage} of {totalPages}
                                </>
                            )}
                        </span>
                        <div
                            className={classNames(styles.actionBtn, { [styles.disabled]: totalPages <= activePage })}
                            onClick={() => handleNextPage()}
                        >
                            <ChevronRight
                                size={16}
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.rightSection}>
                        <div className={styles.zoom}>
                            <div
                                className={classNames(styles.actionBtn, { [styles.disabled]: scale <= 0 })}
                                onClick={() => zoomOut()}
                            >
                                <ZoomOut
                                    size={16}
                                    className={styles.icon}
                                />
                            </div>
                            <span className={classNames(styles.white, styles.scale)}>{ZOOM_SCALE[scale].text}</span>
                            <div
                                className={classNames(styles.actionBtn, { [styles.disabled]: scale >= 5 })}
                                onClick={() => zoomIn()}
                            >
                                <ZoomIn
                                    size={16}
                                    className={styles.icon}
                                />
                            </div>
                        </div>
                        <div className={styles.divider}>|</div>
                        <div className={styles.actionBtn}>
                            <Download
                                size={16}
                                className={styles.icon}
                            />
                        </div>
                    </div>
                </div>
                <div
                    id="pdf-container"
                    className={styles.canvasBox}
                >
                    <canvas id="pdf" />
                    <div className={classNames(styles.canvasLoading, { [styles.show]: isLoading })}>
                        <Loader size={26} />
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    );
};

export default PDFViewer;
