import { configureStore } from '@reduxjs/toolkit';
import treeSlice from '../ComponentTree/store';
import designSlice from '../ComponentDesign/store';

const reducer: any = {};
reducer[treeSlice.name] = treeSlice.reducer;
reducer[designSlice.name] = designSlice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});
