import { configureStore } from '@reduxjs/toolkit';
import { treeSlice } from '../DescriptTree/store';
import { designSlice } from '../DescriptDesign/store';

const reducer: any = {};
reducer[treeSlice.name] = treeSlice.reducer;
reducer[designSlice.name] = designSlice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});
