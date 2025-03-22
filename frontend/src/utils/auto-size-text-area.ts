export function autoResizeTextArea(e: React.FormEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
