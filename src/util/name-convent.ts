/**下划线转驼峰 */
export const underlineToHump = (s: string) => {
  let a = s.toLowerCase().split('_');
  let result = a[0];
  for (let i = 1; i < a.length; i++) {
    result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
  }
  return result;
};

/**下划线转首字母大写驼峰 */
export const underlineToUpHump = (s: string) => {
  let a = s.toLowerCase().split('_');
  let result = a[0];
  for (let i = 1; i < a.length; i++) {
    result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
  }
  result = result[0].toUpperCase() + result.substring(1);
  return result;
};

/**驼峰转下划线 */
export const humpToUnderline = (s: string) => {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**第一个字母小写 */
export const firstToLower = (s: string) => {
  if (s.length > 0) {
    return s.substring(0, 1).toLowerCase() + s.substring(1);
  }
};

/**第一个字母大写 */
export const firstToUpper = (s: string) => {
  if (s.length > 0) {
    return s.substring(0, 1).toLocaleUpperCase() + s.substring(1);
  }
};
