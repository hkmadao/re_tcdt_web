import { useSelector } from 'react-redux';
import { TModuleStore } from '../models';
import { moduleName } from '../conf';
import { DOStatus } from '@/models';

export const useLoadStatus = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].status;
  });
};

export const useFgChange = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const coll = state[moduleName].entityCollection;
    if (coll.action !== DOStatus.UNCHANGED) {
      return true;
    }
    const enti = coll.entities.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (enti) {
      return true;
    }
    const ddEnum = coll.enums.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (ddEnum) {
      return true;
    }
    const nodeUi = coll.nodeUis.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (nodeUi) {
      return true;
    }
    const entityAssociate = coll.entityAssociates.find(
      (entity) => entity.action !== DOStatus.UNCHANGED,
    );
    if (entityAssociate) {
      return true;
    }
    const enumAssociate = coll.enumAssociates.find(
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
    return state[moduleName].entityCollection.idEntityCollection;
  });
};

export const useCurentSelectType = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    if (!state[moduleName].entityCollection.idEntityCollection) {
      return;
    }
    return state[moduleName].currentSelect.concreteType;
  });
};

export const useFgLoadData = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return !!state[moduleName].entityCollection.idEntityCollection;
  });
};

export const useNotDeleteEntities = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const notDeleteEnities = state[moduleName].entityCollection.entities.filter(
      (entity) => {
        return entity.action !== DOStatus.DELETED;
      },
    );
    return notDeleteEnities;
  });
};
