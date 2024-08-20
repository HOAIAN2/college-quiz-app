export function saveBlob(blob: Blob, fileName: string) {
	const objectRul = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = objectRul;
	a.download = fileName;
	a.click();
	URL.revokeObjectURL(objectRul);
}
