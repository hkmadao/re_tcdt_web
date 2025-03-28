import { FC, useRef } from 'react';
import { useState } from 'react';
import { Button, Input, Modal, Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { diagramContentDivId } from '@/pages/DescriptData/DescriptDesign/conf';
import {
  actions,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';
import type {
  TAttribute,
  TEntity,
} from '@/pages/DescriptData/DescriptDesign/models';
import { message } from 'antd/es';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import { nanoid } from '@reduxjs/toolkit';
import { firstToUpper, underlineToHump } from '@/util';
import { DOStatus } from '@/models';

const FromCreateSql: FC = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const inputRef = useRef<TextAreaRef>(null);
  const collection = useSelector(selectEntityCollection);

  const handleOpenModal = () => {
    if (inputRef.current?.resizableTextArea) {
      inputRef.current.resizableTextArea.textArea.value = '';
    }
    setModalVisible(true);
  };

  const handleOk = () => {
    // const inputValue = inputRef.current?.resizableTextArea?.textArea.value;
    // if (inputValue) {
    //   const entitiesJson = JSON.parse(inputValue) as TEntity[];
    //   dispatch(actions.patseEntities(entitiesJson));
    //   setModalVisible(false);
    //   return;
    // }
    // message.error('请输入数据');
  };

  const handleParse = () => {
    const inputValue = inputRef.current?.resizableTextArea?.textArea.value;
    if (inputValue) {
      const sqlStrArr: string[] = inputValue.split('\n\n');
      const crateTableReg: RegExp =
        /CREATE\s+TABLE\s+[`|"]?(\S+)[`|"]?\s+\(([\s|\S]*)\)\s*ENGINE=\S+\s+DEFAULT\s+CHARSET=\S+\s+COLLATE=\S+(\s+COMMENT=['|"]+([\s|\S]+)['|"]+)?;/m;
      const crateTableFragmentSqlArr: string[] = sqlStrArr
        .map((sqlFragmentStr) => {
          //提取建表语句
          const crateTableSqlMatch = sqlFragmentStr.match(crateTableReg);
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
          const crateTableSqlMatch = sqlFragmentStr.match(crateTableReg);
          if (!crateTableSqlMatch || crateTableSqlMatch.length < 2) {
            return entity;
          }
          console.log(crateTableSqlMatch);
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
              const crateColumnReg: RegExp = /^\s*`+(\S+)`+.*/;
              const crateColumnSqlMatch =
                columnFragmentSqlStr.match(crateColumnReg);
              if (!crateColumnSqlMatch || crateColumnSqlMatch.length < 2) {
                return attribute;
              }
              attribute.columnName = crateColumnSqlMatch[1];
              attribute.attributeName = underlineToHump(crateColumnSqlMatch[1]);
              console.log('attribute: ', attribute);
              return attribute;
            })
            .filter((attr) => attr && !!attr.columnName);
          entity.attributes = attrs;
          return entity;
        })
        .filter((entity) => entity && !!entity.tableName);

      dispatch(actions.patseEntities(entities));
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
          disabled={!collection?.idEntityCollection}
          size={'small'}
        />
      </Tooltip>
      <Modal
        width={'800px'}
        title={'从建表语句导入实体'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <Button onClick={handleParse}>解析</Button>
          </div>
          <Input.TextArea ref={inputRef} rows={10}></Input.TextArea>
        </div>
      </Modal>
    </>
  );
};

export default FromCreateSql;
