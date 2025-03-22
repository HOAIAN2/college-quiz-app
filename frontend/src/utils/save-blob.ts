export function saveBlob(blob: Blob, fileName: string) {
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectURL;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectURL);
}
