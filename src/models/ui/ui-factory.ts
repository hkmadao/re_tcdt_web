/**layout：布局；component：组件 */
export type TLayoutType = 'layout' | 'component';
/**row：横向布局；column：纵向布局； */
export type TDirection = 'row' | 'column';
/**auto：根据父盒子空间等分；flex：根据自身盒子内容弹性；custom: 自定义; */
export type TFlexType = 'auto' | 'notGrow' | 'custom';
/**custom：自定义组件；tree：树组件；search：查询组件；viewBillform：列表组件；
 * editBillform：编辑表单组件；viewButton：列表态按钮组件；editButton：编辑态组件 */
export type TComponentType =
  | 'custom'
  | 'tree'
  | 'search'
  | 'viewBillform'
  | 'editBillform'
  | 'viewButton'
  | 'editButton';

export type TPageMap = {
  idPageMap: string;
  componentStateCode: string;
  pageCode: string;
};

/**布局结构。说明：布局可以放布局、组件；*/
export type TLayout = {
  key: string;
  title?: string;
  id: string;
  idParent: string | null;
  order: number;
  direction: TDirection;
  flexType: TFlexType;
  /**flex内容 */
  flexStr: string;
  children: TLayout[];
  type: TLayoutType;
  /**type为component有效 */
  component?: TComponent;
  /**组件页面和UI配置页面的映射关系 */
  pageMaps?: TPageMap[];
};

export type TComponent = {
  componentType: TComponentType;
  name?: string;
  idRef?: string;
};

export type TPage = {
  id: string;
  name: string;
  code: string;
};

/**页面和布局的关系 */
export type TPageAssoLayout = {
  idPage: string;
  idLayout: string;
  hidden: boolean;
  disabled: boolean;
};

type TUiFactoryCommon = {
  idFactory?: string;
  /**所属项目id */
  idProject?: string;
  projectName?: string;
  /**所属子项目id */
  idSubProject?: string;
  subProjectName?: string;
  name?: string;
  displayName?: string;
  idBillform?: string;
  idQuery?: string;
  idTree?: string;
  idButtonAction?: string;
};

export type TUiFactoryContent = {
  pages: TPage[];
  layouts: TLayout[];
  assos: TPageAssoLayout[];
} & TUiFactoryCommon;
