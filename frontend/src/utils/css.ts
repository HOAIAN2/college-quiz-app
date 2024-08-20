export default function css(...classNames: (string | undefined | null)[]) {
	return classNames
		.map(className => className?.trim())
		.filter(i => i)
		.join(' ');
}
