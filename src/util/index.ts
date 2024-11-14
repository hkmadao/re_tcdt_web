export * from './name-convent';
export * from './ui';
export * from './observer';
export * from './jwt';
export * from './tree';

export function getQueryString(url: string, name: string) {
  var reg = new RegExp('(\\?|&)' + name + '=(.*)(&|$)', 'i');
  var r = url.match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export const fetchStringValue = (sourceValue: any) => {
  if (Object.prototype.toString.call(sourceValue) === '[object Array]') {
    const backWritePropArr = sourceValue as string[];
    return backWritePropArr.join(',');
  }
  if (Object.prototype.toString.call(sourceValue) === '[object String]') {
    const backWritePropArr = sourceValue as string;
    return backWritePropArr;
  }
  console.log('未知数据类型');
};

export const deepCopy = (sourceValue: any) => {
  return JSON.parse(JSON.stringify(sourceValue));
};

/**定位元素位置 */
export function elementLocalton(urlHash: string, idElement: string) {
  const m = urlHash.match(/#/g);
  if (!m) {
    return urlHash + '#' + idElement;
  }
  if (m.length === 1) {
    if (urlHash.endsWith('#')) {
      return urlHash + idElement;
    }
    return urlHash + '#' + idElement;
  }
  var reg = new RegExp('#.*?#', 'i');
  var r = urlHash.match(reg);
  if (r) {
    return r[0] + idElement;
  }
  return urlHash + '#' + idElement;
}
