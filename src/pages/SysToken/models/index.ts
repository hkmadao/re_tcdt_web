import { TAudit } from '@/models';

/**令牌 */
export type TToken = {
  /**令牌主属性 */
  idSysToken?: string;
  /**用户名称 */
  username?: string;
  /**昵称 */
  nickName?: string;
  /**创建时间 */
  createTime?: string;
  /**令牌 */
  token?: string;
  /**过期时间 */
  expiredTime?: string;
  /**用户信息序列化 */
  userInfoString?: string;
} & TAudit;
