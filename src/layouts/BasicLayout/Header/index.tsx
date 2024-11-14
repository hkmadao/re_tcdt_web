import { FC } from 'react';
import WebHeader from './web';
import CilentHeader from './client';

const Header: FC<{}> = (props) => {
  const fgCilent = !!window.tcdtAPI;

  return <>{fgCilent ? <CilentHeader /> : <WebHeader />}</>;
};

export default Header;
