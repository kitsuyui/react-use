import { useCallback } from 'react';
import useMountedState from './useMountedState';

export type UsePromise = () => <T>(promise: Promise<T>) => Promise<T>;

const createUnmountedPromiseError = () => new Error('Component unmounted before promise settled');

const usePromise: UsePromise = () => {
	const isMounted = useMountedState();
	return useCallback(
		(promise: Promise<any>) =>
			new Promise<any>((resolve, reject) => {
				const onValue = (value) => {
					if (isMounted()) resolve(value);
					else reject(createUnmountedPromiseError());
				};
				const onError = (error) => {
					reject(error);
				};
				promise.then(onValue, onError);
			}),
		[isMounted]
	);
};

export default usePromise;
