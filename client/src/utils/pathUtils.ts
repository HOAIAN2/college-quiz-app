const pathUtils = {
	join(...paths: (string | number)[]) {
		return '/' + paths
			.map(path => String(path).replace(/\//g, '').trim())
			.filter(i => i)
			.join('/');
	}
};

export default pathUtils;
