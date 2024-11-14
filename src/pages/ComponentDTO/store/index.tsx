import { configureStore } from '@reduxjs/toolkit';
import { treeSlice } from '../ComponentDTOTree/store';
import { designSlice } from '../ComponentDTODesign/store';

const reducer: any = {};
reducer[treeSlice.name] = treeSlice.reducer;
reducer[designSlice.name] = designSlice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});
