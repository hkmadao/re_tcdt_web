import { useSelector, useDispatch } from 'react-redux';
import { TModuleStore } from '../../model';
import { moduleReducerName } from '../../conf';
import { findLayout } from '../../store/util';

export function useAssoByCurrentPageAndLayoutId(id: string) {
  const asso = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.assos.find(
      (asso) =>
        asso.idPage === state[moduleReducerName].currentPageId &&
        asso.idLayout === id,
    );
  });
  return { asso };
}

export function useLayoutByLayoutId(id: string) {
  const layout = useSelector((state: { [x: string]: TModuleStore }) => {
    return findLayout(id, state[moduleReducerName].data.layouts);
  });
  return layout;
}
