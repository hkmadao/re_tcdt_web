import { FC, useEffect, useState } from 'react';
import RefTreeGridPickerInput from './RefTreeGridPickerInput';
import {
  andLogicNode,
  equalFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';

const SelectEntity: FC<{
  entityType: 'agg' | 'entity' | 'enum';
  selectEntityCallBack: (
    data: any,
    entityType: 'agg' | 'entity' | 'enum',
  ) => void;
  resetInputVaule: number;
  idSubProject: string;
}> = ({ entityType, selectEntityCallBack, resetInputVaule, idSubProject }) => {
  const [resetSe, setResetSe] = useState<number>(0);
  const [refColumns, setRefColumns] = useState<any[]>();

  const param: TCondition = {
    logicNode: andLogicNode([
      equalFilterNode(
        'subProjects.idSubProject',
        stringFilterParam(idSubProject ?? ''),
      ),
    ])(),
  };

  useEffect(() => {
    setResetSe(resetInputVaule);
  }, [resetInputVaule]);

  useEffect(() => {
    let cols = [
      {
        /**列属性 */
        name: 'className',
        /**列显示属性 */
        displayName: '类名',
      },
      {
        /**列属性 */
        name: 'displayName',
        /**列显示属性 */
        displayName: '显示名称',
      },
    ];
    if (entityType !== 'enum') {
      cols.push({
        /**列属性 */
        name: 'tableName',
        /**列显示属性 */
        displayName: '表名',
      });
    }
    setRefColumns(cols);
  }, [entityType]);

  return (
    <>
      <RefTreeGridPickerInput
        resetInputVaule={resetSe}
        entityType={entityType}
        selectEntityCallBack={selectEntityCallBack}
        getSelectTreeNodeId={(nodeData) => nodeData.id}
        billRef={{
          idBillRef: '1',
          refStyle: 'table',
          /**回写输入框属性 */
          backWriteProp: entityType === 'enum' ? 'idEnum' : 'idEntity',
          /**输入框显示属性 */
          displayProp: 'displayName',
          /**ref弹出框标题 */
          title: entityType === 'enum' ? '选择枚举' : '选择实体',
          billTreeRef: {
            idBillTreeRef: 'string',
            /**加载树uri */
            uri: '/project/entityCollectionAq',
            /**http方式 */
            method: 'POST',
            /**参数 */
            methodParams: param,
            /**树主属性 */
            keyAttr: 'id',
            /**树显示属性 */
            labelAttr: 'displayName',
            /**上级Id属性 */
            parentIdAttr: 'idParent',
          },
          tableRef: {
            /**表格引用树的属性的键，表格存放树的外键的属性 */
            treeRefMainKey: 'idEntityCollection',
            /**表格主属性，表格数据的id属性 */
            tableMainProp: entityType === 'enum' ? 'idEnum' : 'idEntity',
            /**分页标志 */
            fgPage: false,
            /**ref请求数据uri */
            dataUri: '/entityCollection/getSimpleCollection',
            /**ref表格列配置 */
            refColumns: refColumns,
            searchRefs: [],
          },
        }}
      />
    </>
  );
};

export default SelectEntity;
