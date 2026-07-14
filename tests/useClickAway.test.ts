import { createRef } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useClickAway from '../src/useClickAway';

it('should call the callback only for outside clicks', () => {
	const ref = createRef<HTMLDivElement>();
	const target = document.createElement('div');
	const outside = document.createElement('button');
	const onClickAway = jest.fn();

	target.appendChild(document.createElement('span'));
	document.body.appendChild(target);
	document.body.appendChild(outside);
	ref.current = target;

	renderHook(() => useClickAway(ref, onClickAway));

	target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
	outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

	expect(onClickAway).toHaveBeenCalledTimes(1);

	target.remove();
	outside.remove();
});
