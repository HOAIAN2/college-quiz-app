const getTransitionTiming = (variableName: string) => {
	const timing = getComputedStyle(document.documentElement)
		.getPropertyValue(variableName).replace('s', '');
	return Number(timing) * 1000;
};

const CSS_TIMING = Object.freeze({
	get TRANSITION_TIMING_FAST() { return getTransitionTiming('--transition-timing-fast'); },
	get TRANSITION_TIMING_MEDIUM() { return getTransitionTiming('--transition-timing-medium'); },
	get TRANSITION_TIMING_SLOW() { return getTransitionTiming('--transition-timing-slow'); }
});

export default CSS_TIMING;
