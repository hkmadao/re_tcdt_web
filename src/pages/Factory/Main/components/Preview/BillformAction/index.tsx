import { FC, useEffect, useState } from 'react';
import { Button } from 'antd';
import ModuleAPI from '@/pages/Factory/Units/Action/api';
import { TAction, TActionContent } from '@/pages/Factory/Units/Action/model';

const BillformAction: FC<{ idConf?: string }> = ({ idConf }) => {
  const [actoinConf, setActionConf] = useState<TActionContent>();

  useEffect(() => {
    (async (idConf) => {
      if (idConf) {
        const q: TAction = await ModuleAPI.getById(idConf);
        if (!q.content) {
          return;
        }
        const actionConf: TActionContent = JSON.parse(q.content);
        setActionConf(actionConf);
      }
    })(idConf);
  }, [idConf]);

  return (
    <>
      <div
        style={{
          display: 'block',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: '0 1 auto',
            gap: actoinConf?.gap ?? '10px',
            justifyContent: actoinConf?.justifyContent ?? 'start',
            flexWrap: 'wrap',
          }}
        >
          {actoinConf?.buttons?.map((buttonConf, i) => {
            return (
              <Button
                key={buttonConf?.idButton}
                size={buttonConf?.size}
                type={(buttonConf?.type ?? 'primary') as any}
              >
                {buttonConf?.label}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BillformAction;
