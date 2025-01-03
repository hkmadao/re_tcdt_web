import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { Button, message } from 'antd';
import { actions, saveFileContent } from '../../store';
import { useCurrentFile, useFgEdit } from '../../hooks';
import { TTemplateFile } from '../../models';

const CodeEditArea: FC = () => {
  const dispatch = useDispatch();
  const currentFile = useCurrentFile();
  const fgEdit = useFgEdit();
  const [sourceTemplateFile, setSourceTemplateFile] =
    React.useState<TTemplateFile>();
  const [templateFile, setTemplateFile] = React.useState<TTemplateFile>();

  useEffect(() => {
    if (currentFile && currentFile.fgFile) {
      const newTemplateFile: TTemplateFile = { ...currentFile };
      setTemplateFile(newTemplateFile);
    }
  }, [currentFile]);

  useEffect(() => {
    if (!fgEdit && currentFile && currentFile.fgFile) {
      const newTemplateFile: TTemplateFile = { ...currentFile };
      setTemplateFile(newTemplateFile);
    }
  }, [fgEdit]);

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    if (!templateFile) return;
    const newTemplateFile: TTemplateFile = { ...templateFile, content: val };
    setTemplateFile(newTemplateFile);
  }, []);

  const toggleFgEdit = () => {
    if (!templateFile) {
      message.error('未选中文件');
      return;
    }
    if (!fgEdit) {
      setSourceTemplateFile({ ...templateFile });
    } else {
      if (!sourceTemplateFile) {
        message.error('找不到原文件，无法还原');
        return;
      }
      let newTemplateFile = {
        ...sourceTemplateFile,
        content: undefined,
      };
      setTemplateFile(newTemplateFile);
    }
    dispatch(actions.toggleFgEdit(!fgEdit));
  };

  const handleSave = () => {
    // console.log('value:', value);
    if (!templateFile) {
      message.error('未选中文件');
      return;
    }
    let newTemplateFile = { ...templateFile };
    dispatch(saveFileContent(newTemplateFile));
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: '0 1 auto',
            margin: '0px 5px 0px 5px',
            justifyContent: 'space-between',
          }}
        >
          <span>{templateFile?.filePathName}</span>
          <div
            style={{
              display: 'flex',
              flex: '0 1 auto',
              gap: '5px',
            }}
          >
            <Button
              size={'small'}
              onClick={toggleFgEdit}
              disabled={!currentFile?.fgFile}
            >
              {fgEdit ? '取消' : '编辑'}
            </Button>
            <Button size={'small'} onClick={handleSave} disabled={!fgEdit}>
              保存
            </Button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '1 1 auto',
            overflow: 'auto',
          }}
        >
          <CodeMirror
            editable={fgEdit}
            style={{ width: '100%', backgroundColor: 'rgb(40,43,46)' }}
            theme={androidstudio}
            value={templateFile?.content}
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default CodeEditArea;
