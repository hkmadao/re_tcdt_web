import { useSelector } from 'react-redux';
import { TModuleStore } from '../models';
import { moduleName } from '../conf';
import { DOStatus } from '@/models';

export const useFgChange = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const coll = state[moduleName].dtoCollection;
    if (coll.action !== DOStatus.UNCHANGED) {
      return true;
    }
    const enti = coll.dtoEntities.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (enti) {
      return true;
    }
    const ddEnum = coll.dtoEnums.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (ddEnum) {
      return true;
    }
    const nodeUi = coll.dtoNodeUis.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (nodeUi) {
      return true;
    }
    const entityAssociate = coll.deAssociates.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (entityAssociate) {
      return true;
    }
    const enumAssociate = coll.dtoEnumAssociates.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (enumAssociate) {
      return true;
    }
    return false;
  });
};

export const useFgSelected = (idElement?: string) => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const fgSelectedNode = state[moduleName].selectNodes
      ?.map((n) => n.idElement)
      .includes(idElement);
    if (fgSelectedNode) {
      return true;
    }
    const fgSelectedLine = state[moduleName].selectLines
      ?.map((n) => n.idElement)
      .includes(idElement);
    return fgSelectedLine;
  });
};

export const useSelectedIds = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const selectedNodeIds = state[moduleName].selectNodes?.map(
      (n) => n.idElement,
    );
    const selectedLineIds = state[moduleName].selectLines?.map(
      (n) => n.idElement,
    );
    return { selectedNodeIds, selectedLineIds };
  });
};

export const useIdCollection = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].dtoCollection.idDtoEntityCollection;
  });
};

export const useCurentSelectType = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    if (!state[moduleName].dtoCollection.idDtoEntityCollection) {
      return;
    }
    return state[moduleName].currentSelect.concreteType;
  });
};

export const useFgLoadData = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return !!state[moduleName].dtoCollection.idDtoEntityCollection;
  });
};
