const dateFormat = {
    toDateString(date: Date) {
        const offset = date.getTimezoneOffset();
        const utcDate = new Date(date.getTime() - offset * 60000);
        return utcDate.toISOString().split('T')[0];
    },
    toDateTimeString(date: Date) {
        const offset = date.getTimezoneOffset();
        const utcDate = new Date(date.getTime() - offset * 60000);
        return utcDate.toISOString().split('T').join(' ').split('.')[0];
    },
    toDateTimeMinuteString(date: Date) {
        const offset = date.getTimezoneOffset();
        const utcDate = new Date(date.getTime() - offset * 60000);
        const isoString = utcDate.toISOString();
        return isoString.substring(0, 16);
    },
};

export default Object.freeze(dateFormat);
