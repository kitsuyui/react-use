<div align="center">
  <h1>
    <br/>
    <br/>
    👍
    <br />
    @kitsuyui/react-use
    <br />
    <br />
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@kitsuyui/react-use">
       <img src="https://img.shields.io/npm/v/@kitsuyui/react-use.svg" alt="npm package" />
    </a>
    <a href="https://github.com/kitsuyui/react-use/actions/workflows/test.yml">
      <img src="https://github.com/kitsuyui/react-use/actions/workflows/test.yml/badge.svg" alt="Test workflow" />
    </a>
    <a href="https://www.npmjs.com/package/@kitsuyui/react-use">
      <img src="https://img.shields.io/npm/dm/@kitsuyui/react-use.svg" alt="npm downloads" />
    </a>
    <br />
    Collection of essential <a href="https://reactjs.org/docs/hooks-intro.html">React Hooks</a>.
  </sup>
  <br />
  <br />
  <br />
  <br />
  <p>
    This is <a href="https://github.com/kitsuyui/react-use">kitsuyui/react-use</a>,
    a fork of <a href="https://github.com/streamich/react-use">streamich/react-use</a>.
  </p>
  <pre>bun add <a href="https://www.npmjs.com/package/@kitsuyui/react-use">@kitsuyui/react-use</a></pre>
  <br />
  <br />
  <br />
  <br />
  <br />
</div>

- [**Sensors**](./docs/Sensors.md)
  - [`useBattery`](./docs/useBattery.md) &mdash; tracks device battery state.
  - [`useGeolocation`](./docs/useGeolocation.md) &mdash; tracks geo location state of user's device.
  - [`useHover` and `useHoverDirty`](./docs/useHover.md) &mdash; tracks mouse hover state of some element.
  - [`useHash`](./docs/useHash.md) &mdash; tracks location hash value.
  - [`useIdle`](./docs/useIdle.md) &mdash; tracks whether user is being inactive.
  - [`useIntersection`](./docs/useIntersection.md) &mdash; tracks an HTML element's intersection.
  - [`useKey`](./docs/useKey.md), [`useKeyPress`](./docs/useKeyPress.md), and [`useKeyPressEvent`](./docs/useKeyPressEvent.md) &mdash; track keys.
  - [`useLocation`](./docs/useLocation.md) and [`useSearchParam`](./docs/useSearchParam.md) &mdash; tracks page navigation bar location state.
  - [`useLongPress`](./docs/useLongPress.md) &mdash; tracks long press gesture of some element.
  - [`useMedia`](./docs/useMedia.md) &mdash; tracks state of a CSS media query.
  - [`useMediaDevices`](./docs/useMediaDevices.md) &mdash; tracks state of connected hardware devices.
  - [`useMotion`](./docs/useMotion.md) &mdash; tracks state of device's motion sensor.
  - [`useMouse` and `useMouseHovered`](./docs/useMouse.md) &mdash; tracks state of mouse position.
  - [`useMouseWheel`](./docs/useMouseWheel.md) &mdash; tracks normalized vertical wheel delta.
  - [`useNetworkState`](./docs/useNetworkState.md) &mdash; tracks the state of browser's network connection.
  - [`useOrientation`](./docs/useOrientation.md) &mdash; tracks state of device's screen orientation.
  - [`usePageLeave`](./docs/usePageLeave.md) &mdash; triggers when mouse leaves page boundaries.
  - [`useScroll`](./docs/useScroll.md) &mdash; tracks an HTML element's scroll position.
  - [`useScrolling`](./docs/useScrolling.md) &mdash; tracks whether HTML element is scrolling.
  - [`useStartTyping`](./docs/useStartTyping.md) &mdash; detects when user starts typing.
  - [`useWindowScroll`](./docs/useWindowScroll.md) &mdash; tracks `Window` scroll position.
  - [`useWindowSize`](./docs/useWindowSize.md) &mdash; tracks `Window` dimensions.
  - [`useMeasure`](./docs/useMeasure.md) and [`useSize`](./docs/useSize.md) &mdash; tracks an HTML element's dimensions.
  - [`createBreakpoint`](./docs/createBreakpoint.md) &mdash; tracks `innerWidth`
  - [`useScrollbarWidth`](./docs/useScrollbarWidth.md) &mdash; detects browser's native scrollbars width.
  - [`usePinchZoom`](./docs/usePinchZoom.md) &mdash; tracks pointer events to detect pinch zoom in and out status.
    <br/>
    <br/>
- [**UI**](./docs/UI.md)
  - [`useAudio`](./docs/useAudio.md) &mdash; plays audio and exposes its controls.
  - [`useClickAway`](./docs/useClickAway.md) &mdash; triggers callback when user clicks outside target area.
  - [`useDrop` and `useDropArea`](./docs/useDrop.md) &mdash; tracks file, link and copy-paste drops.
  - [`useSlider`](./docs/useSlider.md) &mdash; provides slide behavior over any HTML element.
  - [`useSpeech`](./docs/useSpeech.md) &mdash; synthesizes speech from a text string.
  - [`useVibrate`](./docs/useVibrate.md) &mdash; provide physical feedback using the [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API).
  - [`useVideo`](./docs/useVideo.md) &mdash; plays video, tracks its state, and exposes playback controls.
    <br/>
    <br/>
- [**Animations**](./docs/Animations.md)
  - [`useRaf`](./docs/useRaf.md) &mdash; re-renders component on each `requestAnimationFrame`.
  - [`useInterval`](./docs/useInterval.md) and [`useHarmonicIntervalFn`](./docs/useHarmonicIntervalFn.md) &mdash; re-renders component on a set interval using `setInterval`.
  - [`useTimeout`](./docs/useTimeout.md) &mdash; re-renders component after a timeout.
  - [`useTimeoutFn`](./docs/useTimeoutFn.md) &mdash; calls given function after a timeout.
  - [`useTween`](./docs/useTween.md) &mdash; re-renders component, while tweening a number from 0 to 1.
  - [`useUpdate`](./docs/useUpdate.md) &mdash; returns a callback, which re-renders component when called.
    <br/>
    <br/>
- [**Side-effects**](./docs/Side-effects.md)
  - [`useAsync`](./docs/useAsync.md), [`useAsyncFn`](./docs/useAsyncFn.md), and [`useAsyncRetry`](./docs/useAsyncRetry.md) &mdash; resolves an `async` function.
  - [`useBeforeUnload`](./docs/useBeforeUnload.md) &mdash; shows browser alert when user try to reload or close the page.
  - [`useCookie`](./docs/useCookie.md) &mdash; provides way to read, update and delete a cookie.
  - [`useCopyToClipboard`](./docs/useCopyToClipboard.md) &mdash; copies text to clipboard.
  - [`useDebounce`](./docs/useDebounce.md) &mdash; debounces a function.
  - [`useError`](./docs/useError.md) &mdash; error dispatcher.
  - [`useFavicon`](./docs/useFavicon.md) &mdash; sets favicon of the page.
  - [`useLocalStorage`](./docs/useLocalStorage.md) &mdash; manages a value in `localStorage`.
  - [`useLockBodyScroll`](./docs/useLockBodyScroll.md) &mdash; lock scrolling of the body element.
  - [`useRafLoop`](./docs/useRafLoop.md) &mdash; calls given function inside the RAF loop.
  - [`useSessionStorage`](./docs/useSessionStorage.md) &mdash; manages a value in `sessionStorage`.
  - [`useThrottle` and `useThrottleFn`](./docs/useThrottle.md) &mdash; throttles a function.
  - [`useTitle`](./docs/useTitle.md) &mdash; sets title of the page.
  - [`usePermission`](./docs/usePermission.md) &mdash; query permission status for browser APIs.
    <br/>
    <br/>
- [**Lifecycles**](./docs/Lifecycles.md)
  - [`useEffectOnce`](./docs/useEffectOnce.md) &mdash; a modified [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook that only runs once.
  - [`useEvent`](./docs/useEvent.md) &mdash; subscribe to events.
  - [`useLifecycles`](./docs/useLifecycles.md) &mdash; calls `mount` and `unmount` callbacks.
  - [`useMountedState`](./docs/useMountedState.md) and [`useUnmountPromise`](./docs/useUnmountPromise.md) &mdash; track if component is mounted.
  - [`usePromise`](./docs/usePromise.md) &mdash; settles wrapped promises without resolving after unmount.
  - [`useLogger`](./docs/useLogger.md) &mdash; logs in console as component goes through life-cycles.
  - [`useMount`](./docs/useMount.md) &mdash; calls `mount` callbacks.
  - [`useUnmount`](./docs/useUnmount.md) &mdash; calls `unmount` callbacks.
  - [`useUpdateEffect`](./docs/useUpdateEffect.md) &mdash; run an `effect` only on updates.
  - [`useIsomorphicLayoutEffect`](./docs/useIsomorphicLayoutEffect.md) &mdash; `useLayoutEffect` that that works on server.
  - [`useDeepCompareEffect`](./docs/useDeepCompareEffect.md), [`useShallowCompareEffect`](./docs/useShallowCompareEffect.md), and [`useCustomCompareEffect`](./docs/useCustomCompareEffect.md)
    <br/>
    <br/>
- [**State**](./docs/State.md)
  - [`createMemo`](./docs/createMemo.md) &mdash; factory of memoized hooks.
  - [`createReducer`](./docs/createReducer.md) &mdash; factory of reducer hooks with custom middleware.
  - [`createReducerContext`](./docs/createReducerContext.md) and [`createStateContext`](./docs/createStateContext.md) &mdash; factory of hooks for a sharing state between components.
  - [`useDefault`](./docs/useDefault.md) &mdash; returns the default value when state is `null` or `undefined`.
  - [`useGetSet`](./docs/useGetSet.md) &mdash; returns state getter `get()` instead of raw state.
  - [`useGetSetState`](./docs/useGetSetState.md) &mdash; as if [`useGetSet`](./docs/useGetSet.md) and [`useSetState`](./docs/useSetState.md) had a baby.
  - [`useLatest`](./docs/useLatest.md) &mdash; returns the latest state or props
  - [`usePrevious`](./docs/usePrevious.md) &mdash; returns the previous state or props.
  - [`usePreviousDistinct`](./docs/usePreviousDistinct.md) &mdash; like `usePrevious` but with a predicate to determine if `previous` should update.
  - [`useObservable`](./docs/useObservable.md) &mdash; tracks latest value of an `Observable`.
  - [`useRafState`](./docs/useRafState.md) &mdash; creates `setState` method which only updates after `requestAnimationFrame`.
  - [`useSetState`](./docs/useSetState.md) &mdash; creates `setState` method which works like `this.setState`.
  - [`useStateList`](./docs/useStateList.md) &mdash; circularly iterates over an array.
  - [`useToggle` and `useBoolean`](./docs/useToggle.md) &mdash; tracks state of a boolean.
  - [`useCounter` and `useNumber`](./docs/useCounter.md) &mdash; tracks state of a number.
  - [`useList`](./docs/useList.md) ~and [`useUpsert`](./docs/useUpsert.md)~ &mdash; tracks state of an array.
  - [`useMap`](./docs/useMap.md) &mdash; tracks state of an object.
  - [`useSet`](./docs/useSet.md) &mdash; tracks state of a Set.
  - [`useQueue`](./docs/useQueue.md) &mdash; implements simple queue.
  - [`useStateValidator`](./docs/useStateValidator.md) &mdash; tracks state of an object.
  - [`useStateWithHistory`](./docs/useStateWithHistory.md) &mdash; stores previous state values and provides handles to travel through them.
  - [`useMultiStateValidator`](./docs/useMultiStateValidator.md) &mdash; alike the `useStateValidator`, but tracks multiple states at a time.
  - [`useMediatedState`](./docs/useMediatedState.md) &mdash; like the regular `useState` but with mediation by custom function.
  - [`useFirstMountState`](./docs/useFirstMountState.md) &mdash; check if current render is first.
  - [`useRendersCount`](./docs/useRendersCount.md) &mdash; count component renders.
  - [`createGlobalState`](./docs/createGlobalState.md) &mdash; cross component shared state.
  - [`useMethods`](./docs/useMethods.md) &mdash; neat alternative to `useReducer`.
    <br/>
    <br/>
- [**Miscellaneous**]()
  - [`useEnsuredForwardedRef`](./docs/useEnsuredForwardedRef.md) and [`ensuredForwardRef`](./docs/useEnsuredForwardedRef.md) &mdash; use a React.forwardedRef safely.

<br />
<br />
<br />
<br />
<br />
<br />
<br />

<p align="center">
  <a href="./docs/Usage.md"><strong>Usage</strong></a> &mdash; how to import.
  <br />
  <a href="./LICENSE"><strong>Unlicense</strong></a> &mdash; public domain.
</p>

<br />
<br />
