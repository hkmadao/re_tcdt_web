import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import { actions, selectTreeContent } from '../../../store';

const NormalCheckbox: FC<{ attr: 'twoLevelStatus' }> = ({ attr }) => {
  const treeContent = useSelector(selectTreeContent);
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    if (treeContent) {
      dispatch(actions.toggleTwoLevelStatus(e.target.checked));
    }
  };

  return (
    <>
      <Checkbox
        checked={treeContent ? treeContent[attr] : false}
        onChange={handleChange}
      />
    </>
  );
};

export default NormalCheckbox;
