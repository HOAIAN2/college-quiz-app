export default function encodeFormData(formData: FormData) {
	const data = new URLSearchParams();
	for (const pair of formData) {
		data.append(pair[0], pair[1] as string);
	}
	return data;
}
