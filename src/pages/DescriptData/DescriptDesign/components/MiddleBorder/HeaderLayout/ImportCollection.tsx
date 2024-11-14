import { FC } from 'react';
import { Button, message, Tooltip, Upload, UploadProps } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';
import { TEntityCollection } from '../../../models';
import { ImportOutlined } from '@ant-design/icons';

const ImportCollection: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);

  const props: UploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload(file, fileList) {
      var reader = new FileReader(); //创建文件对象
      reader.readAsText(file); //读取文件的内容/URL
      reader.onload = function () {
        // 读取完成--->回调函数,result：存储文件内容,this.result访问
        // 切割文本数据 操作内容
        let content = reader.result as string;
        const newCollection: TEntityCollection = JSON.parse(content);
        if (!newCollection || !newCollection.idEntityCollection) {
          message.error('导入数据格式有误！');
          return;
        }
        dispatch(actions.importCollection(newCollection));
      };
      return false;
    },
  };

  return (
    <>
      <Upload {...props} disabled={!entityCollection.idEntityCollection}>
        <Tooltip overlay={'导入集合数据'}>
          <Button
            disabled={!entityCollection.idEntityCollection}
            size={'small'}
            icon={<ImportOutlined />}
          ></Button>
        </Tooltip>
      </Upload>
    </>
  );
};

export default ImportCollection;
