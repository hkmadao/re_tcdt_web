import {
  TLayout,
  EPartName,
  TBillRef,
  TUiFactoryContent,
  TBillFormContent,
  TQueryContent,
} from '@/models';

const findLayout: (
  layoutId: string,
  layouts: TLayout[],
) => TLayout | undefined = (layoutId: string, layouts: TLayout[]) => {
  for (let i = 0; i < layouts.length; i++) {
    let l = layouts[i];
    if (l.id === layoutId) {
      return l;
    }
    const cl = findLayout(layoutId, l.children);
    if (cl) {
      return cl;
    }
  }
};

export const getLayoutById = (
  idLayout: string,
  layoutConf: TUiFactoryContent,
) => {
  return findLayout(idLayout, layoutConf.layouts);
};

export const getAsso = (
  pageCode: string | null,
  idLayout: string,
  layoutConf: TUiFactoryContent,
) => {
  const page = layoutConf.pages.find((p) => p.code === pageCode);
  if (!page) {
    return;
  }
  return layoutConf.assos.find((asso) => {
    return asso.idPage === page.id && asso.idLayout === idLayout;
  });
};

export const getRefByAttr: (
  partName: EPartName,
  attr: string,
  refAttr: string,
  billformConf: TBillFormContent,
) => TBillRef | undefined = (partName, attr, refAttr, billformConf) => {
  let billRef: TBillRef | undefined = undefined;
  if (partName === EPartName.Header) {
    const header = billformConf.configForm?.header;
    if (header) {
      header.forEach((h) => {
        if (h.tabCode === attr) {
          h.billFormFields?.forEach((field) => {
            if (field.name === refAttr && field.refConfig) {
              billRef = {
                ...field.refConfig,
              };
            }
          });
        }
      });
    }
    return billRef;
  }

  if (partName === EPartName.Body) {
    const body = billformConf.configForm?.body;
    if (body) {
      body.forEach((b) => {
        if (b.tabCode === attr) {
          b.billFormFields?.forEach((field) => {
            if (field.name === refAttr && field.refConfig) {
              billRef = {
                ...field.refConfig,
              };
            }
          });
        }
      });
    }
    return billRef;
  }
  return billRef;
};

export const getRefById = (id: string, billformConf: TBillFormContent) => {
  let billRef: TBillRef | undefined = undefined;
  const header = billformConf.configForm?.header;
  if (header) {
    header.forEach((h) => {
      h.billFormFields?.forEach((field) => {
        if (id === field.refConfig?.idBillRef) {
          billRef = {
            ...field.refConfig,
          };
        }
      });
    });
  }
  if (billRef) {
    return billRef;
  }

  const body = billformConf.configForm?.body;
  if (body) {
    body.forEach((b) => {
      b.billFormFields?.forEach((field) => {
        if (id === field.refConfig?.idBillRef) {
          billRef = {
            ...field.refConfig,
          };
        }
      });
    });
  }
  if (billRef) {
    return billRef;
  }
};

export function getQueryAttributeRef(
  attributeName: string,
  queryConf: TQueryContent | undefined,
) {
  return queryConf?.searchRefs.find(
    (searcheRef) => searcheRef.attributeName === attributeName,
  )?.refConfig;
}
