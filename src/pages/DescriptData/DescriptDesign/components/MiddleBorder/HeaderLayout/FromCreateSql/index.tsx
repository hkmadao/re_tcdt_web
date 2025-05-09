import { FC, useRef } from 'react';
import { useState } from 'react';
import { Button, Collapse, Input, Modal, Select, Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import type {
  TAttribute,
  TEntity,
} from '@/pages/DescriptData/DescriptDesign/models';
import { message } from 'antd/es';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import { nanoid } from '@reduxjs/toolkit';
import { firstToUpper, underlineToHump } from '@/util';
import { DOStatus } from '@/models';
import ImportEntityEditTable from './ImportEntityEditTable';
import {
  useIdCollection,
  useSysDataTypes,
} from '@/pages/DescriptData/DescriptDesign/hooks';

const FromCreateSql: FC = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const inputRef = useRef<TextAreaRef>(null);
  const idCollection = useIdCollection();
  const sysDataTypes = useSysDataTypes();
  const [entities, setEntities] = useState<TEntity[]>([]);
  const importEntitiesEditTableRef = useRef<{ getEntities: () => TEntity[] }>(
    null,
  );
  const [dbType, setDbType] = useState<string>('mysql');

  const handleDbTypeChange = (value: string) => {
    if (value !== 'mysql') {
      message.warn('暂时只支持Mysq建表语句解析');
      return;
    }
    setDbType(value);
  };

  const handleOpenModal = () => {
    setEntities([]);
    if (inputRef.current?.resizableTextArea) {
      inputRef.current.resizableTextArea.textArea.value = '';
    }
    setModalVisible(true);
  };

  const handleOk = () => {
    if (importEntitiesEditTableRef?.current) {
      const newEntities = importEntitiesEditTableRef?.current.getEntities();
      // console.log(
      //   'to imports entities: ',
      //   JSON.parse(JSON.stringify(newEntities)),
      // );
      dispatch(actions.patseEntities(newEntities));
      setModalVisible(false);
      return;
    }
  };

  const handleParse = () => {
    console.log('start parse...');
    const inputValue = inputRef.current?.resizableTextArea?.textArea.value;
    if (inputValue) {
      const sqlStrArr: string[] = inputValue.split('\n\n');
      const commonRegStr: string =
        'CREATE\\s+TABLE\\s+[`|"]?([A-Z|a-z|0-9|_]+)[`|"]?\\s+\\(([\\s|\\S]*)\\)\\s*ENGINE=\\S+[\\s|\\S]*(\\s+COMMENT=[\'|"]+([\\s|\\S]+)[\'|"]+)';
      const fragmentReg: RegExp = new RegExp(`${commonRegStr}?;`, 'm');
      const crateTableReg: RegExp = fragmentReg;
      const crateTableHasCommentReg: RegExp = new RegExp(
        `${commonRegStr}+;`,
        'm',
      );
      const crateTableFragmentSqlArr: string[] = sqlStrArr
        .map((sqlFragmentStr) => {
          //提取建表语句
          const crateTableSqlMatch = sqlFragmentStr.match(fragmentReg);
          if (!crateTableSqlMatch || crateTableSqlMatch.length < 1) {
            return '';
          }

          return crateTableSqlMatch[0];
        })
        .filter((sqlStr) => sqlStr && sqlStr.indexOf('CREATE ') === 0);
      const entities = crateTableFragmentSqlArr
        .map((sqlFragmentStr) => {
          const entity: TEntity = {
            idEntity: nanoid(),
            action: DOStatus.NEW,
          };
          //解析建表语句
          let crateTableSqlMatch;
          if (sqlFragmentStr.includes('COMMENT=')) {
            crateTableSqlMatch = sqlFragmentStr.match(crateTableHasCommentReg);
          } else {
            crateTableSqlMatch = sqlFragmentStr.match(crateTableReg);
          }
          if (!crateTableSqlMatch || crateTableSqlMatch.length < 2) {
            return entity;
          }
          // console.log(crateTableSqlMatch);
          const tableName = crateTableSqlMatch[1];
          entity.tableName = tableName;
          entity.className = firstToUpper(underlineToHump(tableName));

          if (crateTableSqlMatch.length >= 5) {
            entity.displayName = crateTableSqlMatch[4];
          }
          //解析字段
          const columnSqlStr = crateTableSqlMatch[2];
          const columnFragmentSqlArr = columnSqlStr.split('\n');
          const attrs = columnFragmentSqlArr
            .map((columnFragmentSqlStr) => {
              const attribute: TAttribute = {
                idAttribute: nanoid(),
                action: DOStatus.NEW,
              };
              let subCommentSql = columnFragmentSqlStr;
              if (columnFragmentSqlStr.indexOf(' COMMENT ') > -1) {
                const commentReg: RegExp =
                  /\s+COMMENT\s+['|"]+([\s|\S]+)['|"]+?/;
                const commentSqlMatch = columnFragmentSqlStr.match(commentReg);
                if (!commentSqlMatch || commentSqlMatch.length < 2) {
                  return attribute;
                }
                attribute.displayName = commentSqlMatch[1];
                subCommentSql = subCommentSql.replace(commentSqlMatch[0], '');
              }
              const crateColumnReg: RegExp = /^\s*`+(\S+)`+\s+(\S+)\s+.*/;
              const crateColumnSqlMatch =
                columnFragmentSqlStr.match(crateColumnReg);
              if (!crateColumnSqlMatch || crateColumnSqlMatch.length < 2) {
                return attribute;
              }
              attribute.columnName = crateColumnSqlMatch[1];
              let attributeType = sysDataTypes.find((dataType) => {
                if (dataType.code === 'PK' || dataType.code === 'FK') {
                  return false;
                }
                if (
                  `${dataType.columnType}(${dataType.len})` ===
                  crateColumnSqlMatch[2]
                ) {
                  return true;
                }
              });
              if (!attributeType) {
                attributeType = sysDataTypes.find((dataType) => {
                  if (dataType.code === 'PK' || dataType.code === 'FK') {
                    return false;
                  }
                  if (
                    `${dataType.columnType}(${dataType.len},${dataType.pcs})` ===
                    crateColumnSqlMatch[2]
                  ) {
                    return true;
                  }
                });
              }
              if (!attributeType) {
                attributeType = sysDataTypes.find((dataType) => {
                  if (dataType.code === 'PK' || dataType.code === 'FK') {
                    return false;
                  }
                  return (
                    crateColumnSqlMatch[2].indexOf(
                      `${dataType.columnType}(`,
                    ) === 0
                  );
                });
              }
              console.log(attributeType);
              attribute.attributeName = underlineToHump(crateColumnSqlMatch[1]);
              attribute.idAttributeType = attributeType?.idDataType;
              // console.log('attribute: ', attribute);
              return attribute;
            })
            .filter((attr) => attr && !!attr.columnName)
            .map((attr, index) => {
              attr.sn = index + 1;
              return attr;
            });
          entity.attributes = attrs;
          return entity;
        })
        .filter((entity) => entity && !!entity.tableName);

      if (entities.length === 0) {
        message.warning('未解析到实体信息');
        return;
      }
      setEntities(entities);
      message.success('解析成功');
      return;
    }
    message.error('请输入数据');
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'从建表语句导入实体'}>
        <Button
          icon={<BlockOutlined />}
          onClick={handleOpenModal}
          disabled={!idCollection}
          size={'small'}
        />
      </Tooltip>
      <Modal
        width={'1200px'}
        title={'从建表语句导入实体'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Collapse defaultActiveKey={['sqlParse']}>
            <Panel header="解析" key="sqlParse">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Select
                    size={'small'}
                    value={dbType}
                    style={{ minWidth: '150px' }}
                    onChange={handleDbTypeChange}
                  >
                    <Select.Option value="mysql">Mysql</Select.Option>
                    <Select.Option value="oracle">Oracle</Select.Option>
                    <Select.Option value="postgres">Postgres</Select.Option>
                    <Select.Option value="sqlserver">SqlServer</Select.Option>
                  </Select>
                  <Button size={'small'} type={'primary'} onClick={handleParse}>
                    解析
                  </Button>
                </div>
                <Input.TextArea ref={inputRef} rows={10}></Input.TextArea>
              </div>
            </Panel>
          </Collapse>
          <div>
            <ImportEntityEditTable
              ref={importEntitiesEditTableRef}
              entitiesProps={entities}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FromCreateSql;
