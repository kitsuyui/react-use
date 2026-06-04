import { useEffect, useState } from 'react';
import { off, on } from './misc/util';

const DELTA_MODE_PIXEL = 0;
const DELTA_MODE_LINE = 1;
const DELTA_MODE_PAGE = 2;
const LINE_HEIGHT_PX = 16;
const DELTA_PRECISION = 1000000;

const roundDelta = (value: number) =>
	Math.round((value + Number.EPSILON) * DELTA_PRECISION) / DELTA_PRECISION;

const normalizeWheelDeltaY = (event: WheelEvent) => {
	if (event.deltaMode === DELTA_MODE_PIXEL) {
		return event.deltaY;
	}

	if (event.deltaMode === DELTA_MODE_LINE) {
		return event.deltaY * LINE_HEIGHT_PX;
	}

	if (event.deltaMode === DELTA_MODE_PAGE) {
		return event.deltaY * window.innerHeight;
	}

	return event.deltaY;
};

export default () => {
	const [mouseWheelScrolled, setMouseWheelScrolled] = useState(0);
	useEffect(() => {
		const updateScroll = (e: WheelEvent) => {
			setMouseWheelScrolled((value) => roundDelta(value + normalizeWheelDeltaY(e)));
		};
		on(window, 'wheel', updateScroll, false);
		return () => off(window, 'wheel', updateScroll);
	}, []);
	return mouseWheelScrolled;
};
