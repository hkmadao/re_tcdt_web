export type LoginResult = {
  /**昵称 */
  nickName: string;
  username: string;
  salt: string;
  token: string;
  expiredTime: number;
};

export type LoginParams = {
  username?: string;
  password?: string;
  salt: string;
  autoLogin?: boolean;
  type?: string;
};

export type ModifyPasswordParams = {
  username?: string;
  oldPassword?: string;
  password?: string;
  salt: string;
  checkedPassword?: string;
};

export type TProfile = {
  /**昵称 */
  nickName: string;
  idUser: string;
  /**
   * 登录账号
   */
  account: string;
  /**
   * 手机号码
   */
  phone: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 姓名
   */
  name: string;
  /**
   * 性别
   */
  gender: string;
};
