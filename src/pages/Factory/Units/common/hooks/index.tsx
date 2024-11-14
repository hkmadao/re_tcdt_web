import { useCallback, useEffect, useState } from 'react';
import API from '../api';
import { fillTreeDatas } from '../util';
import { TDescriptionInfo } from '../model';

export const useMataData = (idComponent: string) => {
  const [metaData, setMetaData] = useState<TDescriptionInfo[]>([]);

  useEffect(() => {
    (async () => {
      const componentTreeData: TDescriptionInfo =
        await API.getComponentAttributeTreeById({
          id: idComponent,
        });
      const newMetaData = [componentTreeData];
      fillTreeDatas(newMetaData, undefined);
      setMetaData(newMetaData);
    })();
  }, [idComponent]);

  return [metaData];
};
