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
    }
};

export default Object.freeze(apiUtils);
