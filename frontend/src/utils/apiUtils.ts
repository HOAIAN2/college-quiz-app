const apiUtils = {
    getFileNameFromContentDisposition(contentDisposition: string | undefined, defaultFileName: string): string {
        if (!contentDisposition) return defaultFileName;
        const utf8FilenameMatch = contentDisposition.match(/filename\*=utf-8''(.+)/);
        if (utf8FilenameMatch && utf8FilenameMatch[1]) {
            return decodeURIComponent(utf8FilenameMatch[1]);
        }
        const standardFilenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (standardFilenameMatch && standardFilenameMatch[1]) {
            return standardFilenameMatch[1];
        }
        return defaultFileName;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleError(error: any) {
        if (!error.response) throw new Error(error.message);
        const message = error.response.data.message;
        // Handle 422 error by Laravel
        if (error.response.data.errors) return Promise.reject(error.response.data.errors);
        throw new Error(message);
    }
};

export default Object.freeze(apiUtils);
