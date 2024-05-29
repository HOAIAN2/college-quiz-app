// export default function css(classNames: string[]) {
// 	return classNames.join(' ')
// }
export default function css(...classNames: (string | undefined)[]) {
	return classNames.join(' ')
}
