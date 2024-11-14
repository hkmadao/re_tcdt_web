//全局初始数据，地址：https://pro.ant.design/zh-CN/docs/initial-state
import * as API from './api';
import menus from './menu';

export async function getInitialState() {
  //获取菜单

  //获取权限
  return {
    menus: menus,
  };
}
