/**模板文件 */
export type TTemplateFile = {
  /**上级目录路径，用'/'分割 */
  parentPathName?: string;
  /**文件路径，用'/'分割 */
  filePathName: string;
  fileName: string;
  fgFile: boolean;
  content?: string;
  children: TTemplateFile[];
};
/**项目 */
export type TProject = {
  /**项目编号 */
  code?: string;
  /**文件名样式 */
  fileNameType?: string;
  /**项目模板编号 */
  templateCode?: string;
  /**项目id */
  idProject?: string;
  /**系统路径 */
  path?: string;
  /**显示名称 */
  displayName?: string;
  /**备注 */
  note?: string;
};
