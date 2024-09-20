export default function getMetaContent(name: string) {
    return document.querySelector<HTMLMetaElement>(`meta[name=${name}]`)?.content;
}
