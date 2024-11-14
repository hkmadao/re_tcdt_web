import { TAudit } from '@/models';

/**角色 */
export type TRole = {
  /**角色id */
  idRole?: string;
  /**名称 */
  name?: string;
  /**显示名称 */
  displayName?: string;
  /**角色 */
  /**角色 */
} & TAudit;
/**角色与菜单 */
export type TRoleMenu = {
  /**角色与菜单id */
  idRoleMenu?: string;
  /**角色 */
  role?: TRole;
  idRole?: string;
  /**系统菜单 */
  menu?: TMenu;
  idMenu?: string;
} & TAudit;
/**用户角色关系 */
export type TUserRole = {
  /**用户角色关系主属性 */
  idSysUserRole?: string;
  /**角色 */
  role?: TRole;
  idRole?: string;
  /**系统用户 */
  user?: TUser;
  idUser?: string;
} & TAudit;
/**系统菜单 */
export type TMenu = {
  /**启用标志 */
  fgActive?: boolean;
  /**菜单类型 */
  menuType?: string;
  /**显示名称 */
  displayName?: string;
  /**前端权限标识 */
  webPerms?: string;
  /**后台权限标识 */
  servicePerms?: string;
  /**路由参数 */
  query?: string;
  /**系统菜单id */
  idMenu?: string;
  /**名称 */
  name?: string;
  /**显示标志 */
  fgShow?: boolean;
} & TAudit;
/**系统用户 */
export type TUser = {
  /**手机号码 */
  phone?: string;
  /**系统用户id */
  idUser?: string;
  /**姓名  */
  name?: string;
  /**启用标志 */
  fgActive?: boolean;
  /**邮箱 */
  email?: string;
  /**性别 */
  gender?: string;
  /**昵称 */
  nickName?: string;
  /**登录账号  */
  account?: string;
  /**用户密码  */
  userPwd?: string;
} & TAudit;
