import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import { useIntersection } from '../src';

class MockIntersectionObserver {
	target?: Element;

	constructor(
		public callback: IntersectionObserverCallback,
		public options?: IntersectionObserverInit
	) {}

	observe(target: Element) {
		this.target = target;
	}

	disconnect() {}
}

const intersectionObserver = {
	observers: [] as MockIntersectionObserver[],
	mock() {
		this.observers = [];
		const observers = this.observers;
		const IntersectionObserverMock = vi.fn(function IntersectionObserver(
			callback: IntersectionObserverCallback,
			options?: IntersectionObserverInit
		) {
			const observer = new MockIntersectionObserver(callback, options);
			observers.push(observer);
			return observer;
		});
		IntersectionObserverMock.prototype = MockIntersectionObserver.prototype;
		Object.assign(globalThis, { IntersectionObserver: IntersectionObserverMock });
		Object.assign(window, { IntersectionObserver: IntersectionObserverMock });
	},
	restore() {
		delete (globalThis as any).IntersectionObserver;
		delete (window as any).IntersectionObserver;
		this.observers = [];
	},
	simulate(entry: IntersectionObserverEntry) {
		for (const observer of this.observers) {
			observer.callback([entry], observer as any);
		}
	},
};

beforeEach(() => {
	intersectionObserver.mock();
	jest.spyOn(global as any, 'IntersectionObserver');
	jest.spyOn(MockIntersectionObserver.prototype, 'disconnect');
});

afterEach(() => {
	intersectionObserver.restore();
});

describe('useIntersection', () => {
	const container = document.createElement('div');
	let targetRef;

	it('should be defined', () => {
		expect(useIntersection).toBeDefined();
	});

	it('should setup an IntersectionObserver targeting the ref element and using the options provided', () => {
		TestUtils.act(() => {
			targetRef = createRef();
			ReactDOM.render(<div ref={targetRef} />, container);
		});

		expect(intersectionObserver.observers).toHaveLength(0);
		const observerOptions = { root: null, threshold: 0.8 };

		renderHook(() => useIntersection(targetRef, observerOptions));

		expect(intersectionObserver.observers).toHaveLength(1);
		expect(intersectionObserver.observers[0].target).toEqual(targetRef.current);
		expect(intersectionObserver.observers[0].options).toEqual(observerOptions);
	});

	it('should return null if a ref without a current value is provided', () => {
		targetRef = createRef();

		const { result } = renderHook(() => useIntersection(targetRef, { root: null, threshold: 1 }));
		expect(result.current).toBe(null);
	});

	it('should reset an intersectionObserverEntry when the ref changes', () => {
		TestUtils.act(() => {
			targetRef = createRef();
			ReactDOM.render(<div ref={targetRef} />, container);
		});

		const { result, rerender } = renderHook(() =>
			useIntersection(targetRef, { root: container, threshold: 0.8 })
		);

		const mockIntersectionObserverEntry = {
			boundingClientRect: targetRef.current.getBoundingClientRect(),
			intersectionRatio: 0.81,
			intersectionRect: container.getBoundingClientRect(),
			isIntersecting: true,
			rootBounds: container.getBoundingClientRect(),
			target: targetRef.current,
			time: 300,
		};
		TestRenderer.act(() => {
			intersectionObserver.simulate(mockIntersectionObserverEntry);
		});

		expect(result.current).toEqual(mockIntersectionObserverEntry);

		targetRef.current = document.createElement('div');
		rerender();

		expect(result.current).toEqual(null);
	});

	it('should return null if IntersectionObserver is not supported', () => {
		targetRef = createRef();
		targetRef.current = document.createElement('div');
		delete (window as any).IntersectionObserver;

		expect(() => renderHook(() => useIntersection(targetRef, {}))).not.toThrow();
	});

	it('should disconnect an old IntersectionObserver instance when the ref changes', () => {
		targetRef = createRef();
		targetRef.current = document.createElement('div');

		const { rerender } = renderHook(() => useIntersection(targetRef, {}));

		targetRef.current = document.createElement('div');
		rerender();

		targetRef.current = null;
		rerender();

		expect(IntersectionObserver).toHaveBeenCalledTimes(2);
		expect(IntersectionObserver.prototype.disconnect).toHaveBeenCalledTimes(2);
	});

	it('should return the first IntersectionObserverEntry when the IntersectionObserver registers an intersection', () => {
		TestUtils.act(() => {
			targetRef = createRef();
			ReactDOM.render(<div ref={targetRef} />, container);
		});

		const { result } = renderHook(() =>
			useIntersection(targetRef, { root: container, threshold: 0.8 })
		);

		const mockIntersectionObserverEntry = {
			boundingClientRect: targetRef.current.getBoundingClientRect(),
			intersectionRatio: 0.81,
			intersectionRect: container.getBoundingClientRect(),
			isIntersecting: true,
			rootBounds: container.getBoundingClientRect(),
			target: targetRef.current,
			time: 300,
		};
		TestRenderer.act(() => {
			intersectionObserver.simulate(mockIntersectionObserverEntry);
		});

		expect(result.current).toEqual(mockIntersectionObserverEntry);
	});

	it('should setup a new IntersectionObserver when the ref changes', () => {
		let newRef;
		TestUtils.act(() => {
			targetRef = createRef();
			newRef = createRef();
			ReactDOM.render(
				<div ref={targetRef}>
					<span ref={newRef} />
				</div>,
				container
			);
		});

		const observerOptions = { root: null, threshold: 0.8 };
		const { rerender } = renderHook(({ ref, options }) => useIntersection(ref, options), {
			initialProps: { ref: targetRef, options: observerOptions },
		});

		expect(intersectionObserver.observers[0].target).toEqual(targetRef.current);

		TestRenderer.act(() => {
			rerender({ ref: newRef, options: observerOptions });
		});

		expect(intersectionObserver.observers.at(-1)?.target).toEqual(newRef.current);
	});

	it('should setup a new IntersectionObserver when the options change', () => {
		TestUtils.act(() => {
			targetRef = createRef();
			ReactDOM.render(<div ref={targetRef} />, container);
		});

		const initialObserverOptions = { root: null as HTMLElement | null, threshold: 0.8 };
		const { rerender } = renderHook(({ ref, options }) => useIntersection(ref, options), {
			initialProps: { ref: targetRef, options: initialObserverOptions },
		});

		expect(intersectionObserver.observers[0].options).toEqual(initialObserverOptions);

		const newObserverOptions = { root: container, threshold: 1 };
		TestRenderer.act(() => {
			rerender({ ref: targetRef, options: newObserverOptions });
		});

		expect(intersectionObserver.observers.at(-1)?.options).toEqual(newObserverOptions);
	});
});
