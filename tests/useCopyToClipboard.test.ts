import { act, renderHook } from '@testing-library/react-hooks';
import useCopyToClipboard from '../src/useCopyToClipboard';

describe('useCopyToClipboard', () => {
	let hook;
	let consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
	let execCommandSpy;

	beforeEach(() => {
		document.execCommand = (() => true) as typeof document.execCommand;
		execCommandSpy = jest.spyOn(document, 'execCommand').mockReturnValue(true);
		hook = renderHook(() => useCopyToClipboard());
	});

	afterEach(() => {
		execCommandSpy.mockRestore();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('should be defined ', () => {
		expect(useCopyToClipboard).toBeDefined();
	});

	it('should pass a given value to copy to clipboard and set state', () => {
		const testValue = 'test';
		let [state, copyToClipboard] = hook.result.current;
		act(() => copyToClipboard(testValue));
		[state, copyToClipboard] = hook.result.current;

		expect(execCommandSpy).toBeCalledWith('copy');
		expect(state.value).toBe(testValue);
		expect(state.noUserInteraction).toBe(true);
		expect(state.error).not.toBeDefined();
	});

	it('should not call copy command if passed an invalid input and set state', () => {
		let testValue = {}; // invalid value
		let [state, copyToClipboard] = hook.result.current;
		act(() => copyToClipboard(testValue));
		[state, copyToClipboard] = hook.result.current;

		expect(execCommandSpy).not.toBeCalled();
		expect(state.value).toBe(testValue);
		expect(state.noUserInteraction).toBe(true);
		expect(state.error).toBeDefined();

		testValue = ''; // empty string is also invalid
		act(() => copyToClipboard(testValue));
		[state, copyToClipboard] = hook.result.current;

		expect(execCommandSpy).not.toBeCalled();
		expect(state.value).toBe(testValue);
		expect(state.noUserInteraction).toBe(true);
		expect(state.error).toBeDefined();
	});

	it('should catch exception thrown by clipboard command and set state', () => {
		execCommandSpy.mockImplementation(() => {
			throw new Error('copy failed');
		});
		let [state, copyToClipboard] = hook.result.current;
		act(() => copyToClipboard('value'));
		[state, copyToClipboard] = hook.result.current;

		expect(execCommandSpy).toBeCalledWith('copy');
		expect(state.value).toBe('value');
		expect(state.noUserInteraction).not.toBeDefined();
		expect(state.error).toStrictEqual(new Error('copy failed'));
	});

	it('should return initial state while unmounted', () => {
		hook.unmount();
		const [state, copyToClipboard] = hook.result.current;

		act(() => copyToClipboard('value'));
		expect(state.value).not.toBeDefined();
		expect(state.error).not.toBeDefined();
		expect(state.noUserInteraction).toBe(true);
	});

	it('should console error if in dev environment', () => {
		const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
		const testValue = {}; // invalid value

		process.env.NODE_ENV = 'development';
		let [state, copyToClipboard] = hook.result.current;
		act(() => copyToClipboard(testValue));
		process.env.NODE_ENV = ORIGINAL_NODE_ENV;

		[state, copyToClipboard] = hook.result.current;

		expect(execCommandSpy).not.toBeCalled();
		expect(consoleErrorSpy).toBeCalled();
		expect(state.value).toBe(testValue);
		expect(state.noUserInteraction).toBe(true);
		expect(state.error).toBeDefined();
	});
});
