import { renderHook } from '@testing-library/react-hooks';
import useVideo from '../src/useVideo';

it('should init video element, state, and controls', () => {
	global.console.error = jest.fn();

	const { result } = renderHook(() =>
		useVideo({ src: 'https://www.example.com/demo.mp4', autoPlay: false })
	);
	const [video, state, controls, ref] = result.current;

	expect(console.error).toHaveBeenCalledTimes(1);
	expect(video.type).toBe('video');
	expect(video.props.src).toBe('https://www.example.com/demo.mp4');
	expect(state.paused).toBe(true);
	expect(state.playing).toBe(false);
	expect(state.volume).toBe(1);

	ref.current = document.createElement('video');
	controls.mute();
	expect(ref.current.muted).toBe(true);
	controls.unmute();
	expect(ref.current.muted).toBe(false);
});
