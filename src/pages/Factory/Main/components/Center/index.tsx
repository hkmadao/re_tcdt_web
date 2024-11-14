import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from './layout';
import { TLayout } from '../../model';
import { selectCurrentPage, selectLayouts } from '../../store';
import TreePriview from '../Preview/Tree';
import SearchPriview from '../Preview/Search';
import ViewActionPriview from '../Preview/ViewAction';
import ViewPriview from '../Preview/View';
import EditActionPriview from '../Preview/BillformAction';
import EditBillformPriview from '../Preview/Billform';

const Center: FC = () => {
  const [content, setContent] = useState<React.ReactNode>(<></>);
  const currentPage = useSelector(selectCurrentPage);
  const layouts = useSelector(selectLayouts);

  const render = (layouts: TLayout[]) => {
    const components = layouts.map((layout) => {
      let childrenCompents: any;
      switch (layout.component?.componentType) {
        case 'editButton':
          childrenCompents = (
            <EditActionPriview idConf={layout.component?.idRef} />
          );
          break;
        case 'editBillform':
          childrenCompents = layout.component?.idRef ? (
            <EditBillformPriview idConf={layout.component?.idRef} />
          ) : undefined;
          break;
        case 'viewButton':
          childrenCompents = (
            <ViewActionPriview idConf={layout.component?.idRef} />
          );
          break;
        case 'viewBillform':
          childrenCompents = layout.component?.idRef ? (
            <ViewPriview idConf={layout.component?.idRef} />
          ) : undefined;
          break;
        case 'search':
          childrenCompents = layout.component?.idRef ? (
            <SearchPriview idConf={layout.component?.idRef} />
          ) : undefined;
          break;
        case 'tree':
          childrenCompents = layout.component?.idRef ? (
            <TreePriview idConf={layout.component?.idRef} />
          ) : undefined;
          break;
        default:
          childrenCompents = render(layout.children);
      }
      const param = { ...layout, layoutChildren: layout.children };
      return <Layout {...param}> {childrenCompents}</Layout>;
    });
    return components;
  };

  useEffect(() => {
    if (!currentPage) {
      return;
    }
    setContent(render(layouts));
  }, [currentPage, layouts]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          width: '60%',
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
