import useEffectOnce from './useEffectOnce';
import useUpdateEffect from './useUpdateEffect';

const shouldLog = () => process.env.NODE_ENV !== 'production';

const useLogger = (componentName: string, ...rest) => {
	useEffectOnce(() => {
		if (!shouldLog()) {
			return;
		}

		console.log(`${componentName} mounted`, ...rest);
		return () => console.log(`${componentName} unmounted`);
	});

	useUpdateEffect(() => {
		if (!shouldLog()) {
			return;
		}

		console.log(`${componentName} updated`, ...rest);
	});
};

export default useLogger;
