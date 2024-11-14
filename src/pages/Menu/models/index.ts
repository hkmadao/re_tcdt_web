import { TAudit } from '@/models';

/**系统菜单 */
export type TMenu = {
  /**系统菜单id */
  idMenu?: string;
  /**名称 */
  name?: string;
  /**显示名称 */
  displayName?: string;
  /**显示标志 */
  fgShow?: boolean;
  /**路由参数 */
  query?: string;
  /**菜单类型 */
  menuType?: string;
  /**启用标志 */
  fgActive?: boolean;
  /**前端权限标识 */
  webPerms?: string;
  /**后台权限标识 */
  servicePerms?: string;
  /**上级系统菜单 */
  parent?: TMenu;
  idParent?: string;
  /**系统菜单 */
  roleMenus?: TRoleMenu;
  /**上级系统菜单 */
  children?: TMenu;
} & TAudit;
/**角色与菜单 */
export type TRoleMenu = {
  /**角色与菜单id */
  idRoleMenu?: string;
} & TAudit;
