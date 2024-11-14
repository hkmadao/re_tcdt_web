import React, { FC } from 'react';
import { Provider } from 'react-redux';
import Component from './components';
import { TRefProps } from './model';
import store from './store';

const RefPicker: FC<TRefProps> = (props) => {
  return (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
};

export default RefPicker;
