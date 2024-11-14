export type User = {
  id?: string;
  username?: string;
  nickName?: string;
  token?: string;
};

export const clearSessionStore = () => {
  window.sessionStorage.removeItem('user');
};

export const setLonginUser = (user: User) => {
  window.sessionStorage.setItem('user', JSON.stringify(user));
};

export const setRediectPath = (uri: string) => {
  window.sessionStorage.setItem('rediectPath', uri);
};

export const getRediectPath = () => {
  return <string>window.sessionStorage.getItem('rediectPath');
};

export const getLonginUser: () => User = () => {
  if (!window.sessionStorage.getItem('user')) {
    return <User>{};
  }
  return <User>JSON.parse(<string>window.sessionStorage.getItem('user'));
};
