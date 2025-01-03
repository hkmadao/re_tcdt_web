import { TDescriptionInfo } from '@/pages/Factory/Units/common/model';
import ModuleAPI from '@/pages/Factory/Units/Form/api';
import { TBillForm } from '@/pages/Factory/Units/Form/model';

export const getMetaData = async (idBillform: string) => {
  const billForm: TBillForm = await ModuleAPI.getById(idBillform);
  if (!billForm.metaData) {
    return;
  }
  const metaData = JSON.parse(billForm.metaData) as TDescriptionInfo;
  return metaData;
};
