import React, { FC, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import Component from './components';
import { TRefProps } from './model';
import store from './store';

const RefPicker: FC<TRefProps> = (props) => {
  const [myProps, setMyProps] = useState<TRefProps>(props);
  useEffect(() => {
    setMyProps(props);
  }, [props]);

  return (
    <Provider store={store}>
      <Component {...myProps} />
    </Provider>
  );
};

export default RefPicker;
