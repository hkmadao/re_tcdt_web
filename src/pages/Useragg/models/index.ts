import { TAudit } from '@/models';

/**系统用户 */
export type TUser = {
  /**系统用户id */
  idUser?: string;
  /**登录账号  */
  account?: string;
  /**用户密码  */
  userPwd?: string;
  /**手机号码 */
  phone?: string;
  /**邮箱 */
  email?: string;
  /**姓名  */
  name?: string;
  /**昵称 */
  nickName?: string;
  /**性别 */
  gender?: string;
  /**启用标志 */
  fgActive?: boolean;
  /**系统用户 */
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
/**角色 */
export type TRole = {
  /**显示名称 */
  displayName?: string;
  /**名称 */
  name?: string;
  /**角色id */
  idRole?: string;
} & TAudit;
