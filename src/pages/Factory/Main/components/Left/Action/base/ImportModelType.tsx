import { selectModuleData } from '@/pages/Factory/Main/store/selects';
import { Button, message } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getMetaData } from './hooks';
import { TModuleType, TAttribute } from '@/pages/Factory/common/model';
import { nanoid } from '@reduxjs/toolkit';
import { TDescriptionInfo } from '@/pages/Factory/Units/common/model';
import { findLayoutBycompType } from '@/pages/Factory/Main/store/util';

const ImportModelType: FC<{
  setModuleTypes: (modelTypes: TModuleType[]) => void;
}> = ({ setModuleTypes }) => {
  const pageDesign = useSelector(selectModuleData);

  const handleImport = async () => {
    const bComp = findLayoutBycompType('viewBillform', pageDesign.layouts);
    const editBComp = findLayoutBycompType('editBillform', pageDesign.layouts);
    if (!bComp && !editBComp) {
      message.error('没有设置表单或者列表组件');
      return;
    }
    let idRef = bComp?.component?.idRef;
    if (!idRef && editBComp?.component?.idRef) {
      idRef = editBComp.component.idRef;
    }
    if (!idRef) {
      message.error('表单或者列表组件没有选中组件');
      return;
    }
    let metaData = await getMetaData(idRef);
    if (!metaData) {
      message.error('根据列表组件找不到描述数据');
      return;
    }
    let moduleTypes: TModuleType[] = [];
    let mainType: TModuleType = buildModuleType(metaData);
    //level_1
    metaData.children?.forEach((child) => {
      if (child.entityInfo) {
        let childType: TModuleType = buildModuleType(child);
        moduleTypes.push(childType);
      }
    });
    //level_2
    metaData.children?.forEach((child) => {
      if (child.entityInfo) {
        child.children?.forEach((child1) => {
          if (child1.entityInfo) {
            let child1Type: TModuleType = buildModuleType(child1);
            moduleTypes.push(child1Type);
          }
        });
      }
    });

    let resultModuleTypes: TModuleType[] = [];
    let classNameArr: string[] = [mainType.className];
    moduleTypes.forEach((moduleType) => {
      if (!classNameArr.includes(moduleType.className)) {
        resultModuleTypes.push(moduleType);
        classNameArr.push(moduleType.className);
      }
    });

    mainType.fgMain = true;
    setModuleTypes([mainType, ...resultModuleTypes]);
    return;
  };

  return (
    <div>
      <Button onClick={handleImport} size={'small'}>
        从元数据导入
      </Button>
    </div>
  );
};

export default ImportModelType;

function buildModuleType(metaData: TDescriptionInfo): TModuleType {
  let moduleType: TModuleType = {
    id: nanoid(),
    className: metaData.entityInfo?.className || '',
    displayName: metaData.entityInfo?.displayName || '',
    fgMain: false,
    mainProperty: metaData.entityInfo?.pkAttributeInfo?.attributeName || '',
    attributes: [],
  };
  let attributes: TAttribute[] = [];
  metaData.children?.forEach((child) => {
    let attributeType = child.typeScriptType ?? '';
    if (child.entityInfo) {
      attributeType = child.entityInfo.className || '';
      if (child.attributeTypeCode === 'InternalArray') {
        attributeType = attributeType + '[]';
      }
    }
    let attr: TAttribute = {
      id: nanoid(),
      attributeName: child.attributeName ?? '',
      displayName: child.displayName ?? '',
      attributeType: attributeType,
      fgPk: child.fgPrimaryKey ?? false,
    };
    attributes.push(attr);
  });
  moduleType.attributes = attributes;
  return moduleType;
}
