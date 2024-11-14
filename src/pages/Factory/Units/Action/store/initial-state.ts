import { TModuleStore } from '../model';

export const initialState: TModuleStore = {
  status: 'idle',
  data: {
    gap: '10px',
    justifyContent: 'start',
    buttons: [],
  },
  current: {
    type: 'field',
    id: '',
  },
};
