import * as API from '@/api';
import { LoginParams, ModifyPasswordParams, TProfile } from '../models';

export default {
  logout: () => {
    return API.POST(`/logout`, undefined);
  },
  login: (params: LoginParams) => {
    return API.POST(`/login`, params);
  },
  modifyPassword: (params: ModifyPasswordParams) => {
    return API.POST(`/user/updatePw`, params);
  },
  getProfile: (): Promise<TProfile> => {
    return API.GET(`/user/getProfile`);
  },
};
