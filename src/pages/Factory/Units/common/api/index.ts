import * as BaseAPI from '@/api';
import { TPageInfoInput } from '@/models';

const CommonAPI = {
  getComponentAttributeTreeById: (param?: { id: string }) => {
    return BaseAPI.GET(`/component/getDescriptionData/${param?.id}`, param);
  },
  getCompnentEntityPage: (params: TPageInfoInput) => {
    return BaseAPI.POST(`/componentEntity/simpleAqPage`, params);
  },
  getCompnentEnumPage: (params: TPageInfoInput) => {
    return BaseAPI.POST(`/componentEnum/simpleAqPage`, params);
  },
  getDescriptionDataByCompEntiId: (params: { id: string }) => {
    return BaseAPI.GET(
      `/componentEntity/getDescriptionData/${params.id}`,
      params,
    );
  },
  getCompnentEnumDetal: (params: { id: string }) => {
    return BaseAPI.GET(`/componentEnum/getDetail/${params.id}`, params);
  },
};
export default CommonAPI;
