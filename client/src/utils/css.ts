export default function css(...classNames: (string | undefined | null)[]) {
	return classNames
		.map(item => item?.trim())
		.join(' ')
		.trim()
}
