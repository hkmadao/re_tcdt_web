import { createAsyncThunk } from '@reduxjs/toolkit';
import BaseAPI from '@/api';
import { treeConf } from '../../../conf';

export const fetchTree = createAsyncThunk(
  `${treeConf?.name}/fetchTree`,
  async (param: void, thunkAPI) => {
    const tree: any = await BaseAPI.POST(`${treeConf?.firstTreeRef?.uri!}`, {});
    return tree;
  },
);
