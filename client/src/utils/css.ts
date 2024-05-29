export default function css(...classNames: (string | undefined | null)[]) {
	return classNames.join(' ').trim()
}
