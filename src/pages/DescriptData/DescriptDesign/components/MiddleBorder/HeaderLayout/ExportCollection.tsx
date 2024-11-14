import React, { FC, useEffect, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import { TEntityCollection } from '../../../models';
import API from '../../../api';
import { DOStatus } from '@/models';
import { ExportOutlined } from '@ant-design/icons';

const ExportCollection: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);

  const handleExport = async () => {
    const resCollection: TEntityCollection = await API.getFullColl({
      id: entityCollection.idEntityCollection,
    });
    const newCollection: TEntityCollection = JSON.parse(
      JSON.stringify(resCollection),
    );
    const entiIds = newCollection.entities
      .filter((enti) => enti.action !== DOStatus.DELETED)
      .map((oEnti) => oEnti.idEntity);
    const enumIds = newCollection.enums
      .filter((enti) => enti.action !== DOStatus.DELETED)
      .map((oEnti) => oEnti.idEnum);
    newCollection.entityAssociates = newCollection.entityAssociates.filter(
      (asso) =>
        asso.action !== DOStatus.DELETED &&
        asso.idUp &&
        entiIds.includes(asso.idUp),
    );
    newCollection.enumAssociates = newCollection.enumAssociates.filter(
      (asso) =>
        asso.action !== DOStatus.DELETED &&
        asso.idEnum &&
        enumIds.includes(asso.idEnum),
    );
    newCollection.entities = newCollection.entities
      .filter((enti) => enti.action !== DOStatus.DELETED)
      .map((enti) => {
        enti.attributes = enti.attributes?.filter(
          (attr) => attr.action !== DOStatus.DELETED,
        );
        return enti;
      });
    newCollection.enums = newCollection.enums
      .filter((ddEnum) => ddEnum.action !== DOStatus.DELETED)
      .map((enti) => {
        enti.attributes = enti.attributes?.filter(
          (attr) => attr.action !== DOStatus.DELETED,
        );
        return enti;
      });
    newCollection.nodeUis = newCollection.nodeUis.filter(
      (nd) => nd.idElement && entiIds.concat(enumIds).includes(nd.idElement),
    );
    newCollection.outEntities = [];
    newCollection.outEnums = [];
    //字段类型数据保留，便于导入
    // newCollectionData.sysDataTypes = [];
    const bj = new Blob([JSON.stringify(newCollection, undefined, 4)]);
    const reader = new FileReader();
    reader.readAsDataURL(bj);
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const a = document.createElement('a');
      a.download = newCollection.displayName + '.json';
      a.href = reader.result?.toString() || '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  return (
    <>
      <Tooltip overlay={'导出集合数据'}>
        <Button
          onClick={handleExport}
          disabled={!entityCollection.idEntityCollection}
          size={'small'}
          icon={<ExportOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default ExportCollection;
