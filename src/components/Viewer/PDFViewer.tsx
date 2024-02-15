import { useEffect, useState } from "react";
import styles from "./PDFViewer.module.scss";
import { isMobile, isTablet } from "react-device-detect";
import useRenderPDF, { ZOOM_SCALE } from "../../utils/renderPDF";
import { ChevronLeft, ChevronRight, Download, Loader, Maximize, Minimize, Minus, MoreVertical, Plus, ZoomIn } from "react-feather";
import classNames from "classnames";
import { PdfViewerProps } from "./PDFViewer.types";

const regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;

const PDFViewer = ({ src }: PdfViewerProps) => {
    const [open_option, setOpenOption] = useState(false);
    const [expand, setExpand] = useState(false);
    const [is_loading_download, setIsLoadingDownload] = useState(false);

    const { filename, isLoading, totalPages, render, activePage, nextPage, previousPage, zoomIn, zoomOut, scale } = useRenderPDF({
        src,
        id: "pdf",
    });

    const handleReRenderPDF = async () => {
        if (src && !regex.test(src)) {
            await render();
        }
    };

    useEffect(() => {
        if (isMobile || isTablet) {
            handleReRenderPDF();
        }
    }, [activePage, scale]);

    const handleNextPage = () => {
        nextPage();
    };

    const handlePreviousPage = () => {
        previousPage();
    };

    const handleToggleExpandPDF = () => {
        if (expand) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
        setOpenOption(false);
        setExpand(!expand);
    };

    const handleDownloadPDF = async () => {
        setIsLoadingDownload(true);
        await fetch(src)
            .then((response) => {
                const file_name = response.headers.get("Content-Disposition")?.split('"')?.[0];

                response.blob().then((blob) => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = file_name || filename;
                    a.click();
                });
            })
            .finally(() => {
                setIsLoadingDownload(false);
                setOpenOption(false);
            });
    };

    return (
        <div
            className={classNames(styles.container, {
                [styles.expanded]: expand,
            })}
        >
            {!isMobile && !isTablet ? (
                <iframe
                    src={src}
                    title="React PDF Viewer V 1.0.3"
                />
            ) : (
                <div className={styles.canvasContainer}>
                    <div
                        className={classNames(styles.dropdownBackdrop, {
                            [styles.show]: open_option,
                        })}
                        onClick={() => {
                            setOpenOption(false);
                        }}
                    >
                        <div
                            className={styles.option}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className={classNames(styles.list, { [styles.nonActive]: is_loading_download })}>
                                <div
                                    className={styles.item}
                                    onClick={() => handleDownloadPDF()}
                                >
                                    {is_loading_download ? (
                                        <Loader
                                            size={14}
                                            className={styles.icon}
                                        />
                                    ) : (
                                        <Download
                                            size={14}
                                            className={styles.icon}
                                        />
                                    )}

                                    <span>{is_loading_download ? "กำลังบันทึกไฟล์" : "บันทึกไฟล์"}</span>
                                </div>
                                <div className={styles.lineDivider} />
                                <div className={classNames(styles.item, styles.nonActive)}>
                                    <ZoomIn
                                        size={14}
                                        className={styles.icon}
                                    />
                                    <span>ซูม</span>
                                    <div className={styles.zoom}>
                                        <div
                                            className={classNames(styles.actionBtn, styles.black, { [styles.disabled]: scale <= 0 })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                zoomOut();
                                            }}
                                        >
                                            <Minus
                                                size={14}
                                                className={styles.icon}
                                            />
                                        </div>
                                        <span className={classNames(styles.scale)}>{ZOOM_SCALE[scale].text}</span>
                                        <div
                                            className={classNames(styles.actionBtn, styles.black, { [styles.disabled]: scale >= 5 })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                zoomIn();
                                            }}
                                        >
                                            <Plus
                                                size={14}
                                                className={styles.icon}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.lineDivider} />

                                <div
                                    className={styles.item}
                                    onClick={() => handleToggleExpandPDF()}
                                >
                                    {expand ? (
                                        <Minimize
                                            size={14}
                                            className={styles.icon}
                                        />
                                    ) : (
                                        <Maximize
                                            size={14}
                                            className={styles.icon}
                                        />
                                    )}

                                    <span>{expand ? "ออกจากโหมดเต็มจอ" : "ขยายเต็มจอ"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.topBar}>
                        <div className={styles.leftSection}>
                            <div className={classNames(styles.filenameBox, styles.white)}>{filename}</div>
                        </div>
                        {/* <div className={styles.certerSection}></div> */}
                        <div className={styles.rightSection}>
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
                                หน้า {activePage} จาก {totalPages}
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
                            <div
                                className={styles.actionBtn}
                                onClick={() => setOpenOption(!open_option)}
                            >
                                <MoreVertical
                                    size={16}
                                    className={styles.icon}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.canvasBox}>
                        <canvas id="pdf" />
                        <div className={classNames(styles.canvasLoading, { [styles.show]: isLoading })}>
                            <Loader size={26} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PDFViewer;
