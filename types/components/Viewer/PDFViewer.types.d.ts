type OptionProps = {
    save: string;
    save_loading: string;
    zoom: string;
    expand: string;
    exit_expand: string;
};
type PdfViewerProps = {
    src: string;
    pageInfoTextFormat?: (curent: number, totals: number) => string;
    optionText?: OptionProps;
};
export type { OptionProps, PdfViewerProps };
