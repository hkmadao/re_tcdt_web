import { moduleReducerName } from '../conf';
import { TModuleStore } from '../model';
import { useSelector, useDispatch } from 'react-redux';

export const useFgLoadData = () => {
  const fgLoadData = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      !!state[moduleReducerName].data.idTree,
  );
  return fgLoadData;
};

export const useMainEntityAttrs = () => {
  const attrs = useSelector((state: { [x: string]: TModuleStore }) => {
    const attrs: { value: string }[] = [];
    const metaData = state[moduleReducerName].data.metaData;
    if (metaData && metaData.children) {
      const attrsNew = metaData.children.map((c) => {
        return { value: c.attributeName ?? '' };
      });
      attrs.push(...attrsNew);
    }
    return attrs;
  });
  return attrs;
};

export const useMainAttributeName = () => {
  const attributeName = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.metaData?.attributeName;
  });
  return attributeName;
};

export const useMainDisplayName = () => {
  const displayName = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.metaData?.displayName;
  });
  return displayName;
};

export const useMainEntityName = () => {
  const className = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.metaData?.entityInfo?.className;
  });
  return className;
};
