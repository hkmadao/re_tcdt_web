import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Observer, TMessage } from '@/util/observer';
import { TLayout } from '@/models';
import Layout from './layout';
import { actions } from '../store/slice';
import { usePageCode, useIdUiConf } from '../hooks';
import { layoutConf } from '../conf';
import { getAsso, getLayoutById } from '@/util';
import { subject } from '../conf';
import TableLayout from './billform/tablelayout';
import FormLayout from './billform/formlayout';
import LeftTree from './lefttree';
import TableToolBar from './toolbar/tabletoolbar';
import FormToolBar from './toolbar/formtoolbar';
import SearchArea from './searcharea';

const Center: FC = () => {
  const pageCode = usePageCode();
  const idUiConf = useIdUiConf();
  const [content, setContent] = useState<React.ReactNode>(<></>);

  const dispatch = useDispatch();

  useEffect(() => {
    const pageObserver: Observer = {
      topic: '/page/change',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.producerId) {
          const layout = getLayoutById(message.producerId, layoutConf);
          const pageMaps = layout?.pageMaps ?? [];
          const pageMap = pageMaps.find(
            (p) => p.componentStateCode === message.data,
          );
          if (pageMap && pageMap.pageCode) {
            dispatch(actions.changePageStatus(pageMap.pageCode));
          }
        }
      },
    };
    subject.subscribe(pageObserver);

    const addLoadingCountObserver: Observer = {
      topic: '/page/addLoadingCount',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        dispatch(actions.addLoadingCount());
      },
    };
    subject.subscribe(addLoadingCountObserver);

    const reduceLoadingCountObserver: Observer = {
      topic: '/page/reduceLoadingCount',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        setTimeout(function () {
          dispatch(actions.reduceLoadingCount());
        }, 100);
      },
    };
    subject.subscribe(reduceLoadingCountObserver);

    return () => {
      subject.unsubsribe(pageObserver);
      subject.unsubsribe(addLoadingCountObserver);
      subject.unsubsribe(reduceLoadingCountObserver);
    };
  }, []);

  const render = (layouts: TLayout[], pageCode: string) => {
    const components = layouts.map((layout) => {
      const asso = getAsso(pageCode, layout.id, layoutConf);
      if (!asso || asso.hidden) {
        return;
      }
      const param = { ...layout, layoutChildren: layout.children };
      if (layout.type === 'component') {
        if (layout.component?.componentType === 'viewBillform') {
          return (
            <Layout {...param}>
              <TableLayout
                idLayout={layout.id}
                fgDisabled={asso.disabled}
                fgHidden={asso.hidden}
              />
            </Layout>
          );
        }
        if (layout.component?.componentType === 'editBillform') {
          return (
            <Layout {...param}>
              <FormLayout
                idLayout={layout.id}
                fgDisabled={asso.disabled}
                fgHidden={asso.hidden}
              />
            </Layout>
          );
        }
        if (layout.component?.componentType === 'tree') {
          return (
            <Layout {...param}>
              <LeftTree
                idLayout={layout.id}
                fgDisabled={asso.disabled}
                fgHidden={asso.hidden}
              />
            </Layout>
          );
        }
        if (layout.component?.componentType === 'viewButton') {
          return (
            <Layout {...param}>
              <TableToolBar
                idLayout={layout.id}
                fgDisabled={asso.disabled}
                fgHidden={asso.hidden}
              />
            </Layout>
          );
        }
        if (layout.component?.componentType === 'editButton') {
          return (
            <Layout {...param}>
              <FormToolBar
                idLayout={layout.id}
                fgDisabled={asso.disabled}
                fgHidden={asso.hidden}
              />
            </Layout>
          );
        }
        if (layout.component?.componentType === 'search') {
          return (
            <Layout {...param}>
              <SearchArea
                idLayout={layout.id}
                fgDisabled={asso.disabled}
                fgHidden={asso.hidden}
              />
            </Layout>
          );
        }
        return <Layout {...param}>自定义组件</Layout>;
      }
      const childrenCompents = render(layout.children, pageCode);
      return <Layout {...param}>{childrenCompents}</Layout>;
    });
    return components;
  };

  useEffect(() => {
    if (!pageCode) {
      return;
    }
    setContent(render(layoutConf.layouts, pageCode));
  }, [pageCode]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          margin: '5px 0px 5px 0px',
          overflow: 'auto',
        }}
      >
        {content}
      </div>
    </>
  );
};

export default Center;
