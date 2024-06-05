const getTransitionTiming = (variableName: string) => {
	const timing = getComputedStyle(document.documentElement)
		.getPropertyValue(variableName).replace('s', '');
	return Number(timing) * 1000;
};

export const TRANSITION_TIMING_FAST = getTransitionTiming('--transition-timing-fast');
export const TRANSITION_TIMING_MEDIUM = getTransitionTiming('--transition-timing-medium');
export const TRANSITION_TIMING_SLOW = getTransitionTiming('--transition-timing-slow');
