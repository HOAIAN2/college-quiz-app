const themeUtils = {
    setVariable(key: string, value: string) {
        const variableName = key.startsWith('--') ? key : '--' + key;
        document.documentElement.style.setProperty(variableName, value);
    },
    getVariable(key: string) {
        const variableName = key.startsWith('--') ? key : '--' + key;
        getComputedStyle(document.documentElement).getPropertyValue(variableName);
    }
};

export default Object.freeze(themeUtils);
