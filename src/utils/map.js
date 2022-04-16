export default (list = []) => {
  let map = [];

  const findIndex = (value, reverse = false) => map.findIndex(([x, y]) => (reverse ? y : x) === value);

  const has = (value, reverse = false) => findIndex(value, reverse) > -1;

  const get = (value, reverse = false) => {
    if (has(value, reverse)) {
      const mapItem = map[findIndex(value, reverse)];
      return mapItem[reverse ? 0 : 1];
    }
    return null;
  }

  const remove = (value, reverse = false) => {
    if (has(value, reverse)) {
      const index = findIndex(value, reverse);
      map = [
        ...map.slice(0, index),
        ...map.slice(index + 1),
      ];
      return true;
    }
    return false;
  }

  list.forEach(([x, y]) => {
    map = [
      ...map,
      [x, y],
    ];
  });


  return {
    data: map,
    has,
    get,
    remove,
  };
};
