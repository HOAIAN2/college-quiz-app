export default function css(...classNames: (string | undefined | null)[]) {
	return classNames
		.filter(i => i)
		.map(className => className?.trim())
		.join(' ')
}
