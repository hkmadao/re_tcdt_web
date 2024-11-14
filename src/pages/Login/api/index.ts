import * as API from '@/api';
import { LoginParams } from '../models';

export default {
  login: (params: LoginParams) => {
    return API.POST(`/login`, params);
  },
};
