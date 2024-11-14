import Action from './Action';
import TreeAttr from './TreeAttr';
import { useFgLoadData } from '../../hooks';

const Left = () => {
  const fgLoadData = useFgLoadData();

  return (
    <div
      style={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        width: '30%',
        margin: '5px 5px 5px 5px',
        backgroundColor: 'white',
      }}
    >
      <Action />
      <div
        style={{
          display: fgLoadData ? 'flex' : 'none',
          flex: 'auto',
        }}
      >
        <TreeAttr />
      </div>
    </div>
  );
};

export default Left;
