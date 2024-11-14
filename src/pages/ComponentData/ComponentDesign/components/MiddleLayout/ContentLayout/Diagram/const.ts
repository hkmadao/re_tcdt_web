/** port的类型
 * */
export enum PortModelType {
  TARGET = 'target',
  SOURCE = 'source',
}

export enum MdModelType {
  MDPORT = 'mdPort',
  MDNODE = 'mdNode',
  MDLINK = 'mdLink',
  MDLABEL = 'mdLabel',
}

/** 实体内部表格columns */
export const DiagramEntityColumns = [
  { title: '', dataIndex: 'sn', width: 30 },
  { title: '', dataIndex: 'na' },
];
