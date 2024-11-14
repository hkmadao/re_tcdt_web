import {
  Button,
  Collapse,
  Descriptions,
  Input,
  InputRef,
  Popconfirm,
  Select,
  Space,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions, selectCurrentPage } from '../../../store';
import { TDirection, TLayoutType } from '../../../model';

const Page: FC = () => {
  const dipatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const nameRef = useRef<InputRef>(null);
  const [nameValue, setNameValue] = useState<string>();
  const codeRef = useRef<InputRef>(null);
  const [codeValue, setCodeValue] = useState<string>();

  const { Panel } = Collapse;

  useEffect(() => {
    if (currentPage && nameRef.current?.input) {
      setNameValue(currentPage.name);
      setCodeValue(currentPage.code);
      // const evt = new InputEvent('input', {});
      // nameRef.current.input.dispatchEvent(evt);
    }
  }, [currentPage]);

  const handleChange = () => {};

  const handleNameChange = (e: any) => {
    setNameValue(nameRef.current?.input?.value.trim());
  };

  const handleCodeChange = (e: any) => {
    setCodeValue(codeRef.current?.input?.value.trim());
  };

  const handleDelete = () => {
    if (currentPage) {
      dipatch(actions.removePage(currentPage));
    }
  };

  const handleBlur = () => {
    if (currentPage && nameRef.current?.input?.value) {
      dipatch(
        actions.updatePage({
          ...currentPage,
          name: nameRef.current?.input?.value,
        }),
      );
    }
  };

  const handleCodeBlur = () => {
    if (currentPage && codeRef.current?.input?.value) {
      dipatch(
        actions.updatePage({
          ...currentPage,
          code: codeRef.current?.input?.value,
        }),
      );
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
        }}
      >
        <Collapse
          defaultActiveKey={['1']}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <Panel header="属性1" key="1">
            <Descriptions column={1} bordered size={'small'}>
              <Descriptions.Item label="属性">值</Descriptions.Item>
              <Descriptions.Item label="ID">
                <Space size={'small'} align="center" wrap>
                  <span>{currentPage?.id}</span>
                  <Popconfirm
                    disabled={currentPage?.id === 'index'}
                    placement="top"
                    title={'确定要删除？'}
                    onConfirm={handleDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      disabled={currentPage?.id === 'index'}
                      size={'small'}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="编码">
                <Input
                  ref={codeRef}
                  value={codeValue}
                  onBlur={handleCodeBlur}
                  key={'code'}
                  onChange={handleCodeChange}
                />
              </Descriptions.Item>
              <Descriptions.Item label="名称">
                <Input
                  ref={nameRef}
                  value={nameValue}
                  onBlur={handleBlur}
                  key={'name'}
                  onChange={handleNameChange}
                />
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default Page;
