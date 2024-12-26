import { PRIMARY_COLOR_KEY } from '~config/env';

const themeUtils = {
    setVariable(key: string, value: string) {
        const variableName = key.startsWith('--') ? key : '--' + key;
        document.documentElement.style.setProperty(variableName, value);
    },
    getVariable(key: string) {
        const variableName = key.startsWith('--') ? key : '--' + key;
        return getComputedStyle(document.documentElement).getPropertyValue(variableName);
    },
    setPrimaryColor(value: string) {
        this.setVariable('color-primary', value);
        localStorage.setItem(PRIMARY_COLOR_KEY, value);
    },
    getPrimaryColor() {
        return localStorage.getItem(PRIMARY_COLOR_KEY);
    }
};

export default Object.freeze(themeUtils);
