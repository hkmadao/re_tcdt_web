import * as API from '@/api';
import { TCondition } from '@/models';
import { TComponent } from '../models';

const ComponentDesignAPI = {
  getDataType: (params: TCondition) => {
    return API.POST('/dataType/aq', params);
  },
  getComponentById: (params: { idComponent: string }) => {
    return API.GET(`/component/extGetById/${params.idComponent}`);
  },
  saveComponent: (params: TComponent) => {
    return API.POST('/component/saveByAction', params);
  },
  /**根据实体id获取完整属性 */
  getAttributesByEntityId: (params: { idEntity: string }) => {
    return API.GET('/entity/getAttributesByEntityId');
  },
  getCompEntities: (params: TCondition) => {
    return API.POST('/componentEntity/simpleAq', params);
  },
  getCompEnums: (params: TCondition) => {
    return API.POST('/componentEnum/simpleAq', params);
  },
};

export default ComponentDesignAPI;
