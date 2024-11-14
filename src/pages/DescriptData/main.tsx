import { FC, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectModuleStaus,
} from '@/pages/DescriptData/DescriptDesign/store';
import MiddleLayout from '@/pages/DescriptData/DescriptDesign/components/MiddleLayout';
import LeftLayout from '@/pages/DescriptData/DescriptTree/components/LeftLayout';
import styles from './index.less';
import classNames from 'classnames';
import HeaderLayout from './DescriptDesign/components/MiddleBorder/HeaderLayout';
import RightLayout from './DescriptDesign/components/MiddleBorder/RightLayout';
import FooterLayout from './DescriptDesign/components/MiddleBorder/FooterLayout';
import { Prompt } from 'umi';
import { useFgChange } from './DescriptDesign/hooks';

const Module: FC = () => {
  const fgChange = useFgChange();
  const status = useSelector(selectModuleStaus);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('reset')
    dispatch(actions.reset());
  }, []);

  return (
    <>
      <Prompt
        message={(location, action) => {
          if (location.pathname === '/devmanager/descriptdata') {
            return false;
          }
          if (fgChange) {
            // 返回 string 会提示用户，让用户选择是否离开
            return `当前页面未保存内容将丢弃，确认离开吗?`;
          }
          // 返回 true 表示不拦截, 你可也检查当前页面数据，提示用户是否放弃填写的数据
          return true;
        }}
      />
      <Spin
        spinning={status === 'loading'}
        wrapperClassName={classNames(styles.spin)}
        delay={50}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              overflow: 'hidden',
              flexDirection: 'column',
            }}
          >
            <HeaderLayout />
            <div
              style={{
                display: 'flex',
                flex: 'auto',
                justifyContent: 'space-between',
                overflow: 'auto',
                // height: '80vh',
              }}
            >
              <LeftLayout />
              <RightLayout />
            </div>
            <FooterLayout />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            overflow: 'auto',
          }}
        >
          <MiddleLayout />
        </div>
      </Spin>
    </>
  );
};

export default Module;
