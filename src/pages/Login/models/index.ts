export type LoginResult = {
  /**昵称 */
  nickName: string;
  username: string;
  token: string;
  expiredTime: number;
};

export type LoginParams = {
  username?: string;
  password?: string;
  autoLogin?: boolean;
  type?: string;
};
