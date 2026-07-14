import { act, renderHook } from '@testing-library/react-hooks';
import useSpeech from '../src/useSpeech';

class MockSpeechSynthesisUtterance {
	lang = '';
	voice?: SpeechSynthesisVoice;
	rate = 1;
	pitch = 1;
	volume = 1;
	onstart?: () => void;
	onpause?: () => void;
	onresume?: () => void;
	onend?: () => void;

	constructor(public text: string) {}
}

it('should reflect speech synthesis lifecycle events', () => {
	const spoken: MockSpeechSynthesisUtterance[] = [];
	(globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
	Object.defineProperty(window, 'speechSynthesis', {
		configurable: true,
		value: {
			speak: (utterance: MockSpeechSynthesisUtterance) => {
				spoken.push(utterance);
			},
		},
	});

	const { result } = renderHook(() => useSpeech('hello', { lang: 'en-US', rate: 1.5 }));
	const [utterance] = spoken;

	expect(utterance.text).toBe('hello');
	expect(result.current.status).toBe('init');

	act(() => {
		utterance.onstart?.();
	});
	expect(result.current.status).toBe('play');
	expect(result.current.isPlaying).toBe(true);

	act(() => {
		utterance.onpause?.();
	});
	expect(result.current.status).toBe('pause');
	expect(result.current.isPlaying).toBe(false);

	act(() => {
		utterance.onend?.();
	});
	expect(result.current.status).toBe('end');
	expect(result.current.isPlaying).toBe(false);
});
