export * from './meta-data';

export * from './tree-ref';
export * from './search-ref';
export * from './ref';
export * from './enum-ref';

export type EInputType =
  | 'Input'
  | 'InputNumber'
  | 'Text'
  | 'Checkbox'
  | 'DateTime'
  | 'Date'
  | 'Time'
  | 'Image'
  | 'File'
  | 'Ref'
  | 'Select';

export type EValueType = 'Bool' | 'String' | 'I32' | 'I64' | 'F32' | 'F64';
