const hasOwn = Object.prototype.hasOwnProperty;

const isDeepEqual = (left: any, right: any): boolean => {
  if (Object.is(left, right)) {
    return true;
  }

  if (
    typeof left !== 'object' ||
    left === null ||
    typeof right !== 'object' ||
    right === null
  ) {
    return false;
  }

  const leftConstructor = left.constructor;
  const rightConstructor = right.constructor;
  if (
    leftConstructor !== rightConstructor &&
    leftConstructor !== undefined &&
    rightConstructor !== undefined
  ) {
    return false;
  }

  if (Array.isArray(left)) {
    if (!Array.isArray(right) || left.length !== right.length) {
      return false;
    }

    for (let index = 0; index < left.length; index += 1) {
      if (!isDeepEqual(left[index], right[index])) {
        return false;
      }
    }

    return true;
  }

  if (left instanceof Date || right instanceof Date) {
    return left instanceof Date && right instanceof Date && left.getTime() === right.getTime();
  }

  if (left instanceof RegExp || right instanceof RegExp) {
    return left instanceof RegExp && right instanceof RegExp && left.toString() === right.toString();
  }

  const leftKeys = Object.keys(left).filter((key) => key !== '_owner');
  const rightKeys = Object.keys(right).filter((key) => key !== '_owner');
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!hasOwn.call(right, key) || !isDeepEqual(left[key], right[key])) {
      return false;
    }
  }

  return true;
};

export default isDeepEqual;
