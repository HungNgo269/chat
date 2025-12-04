export const getErrorMessage = (error: any): string => {
    return (
        error?.response?.message || error?.message || "Có lỗi không rõ xảy ra"
    );
};
