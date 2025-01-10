import { MenuDataItem } from '@ant-design/pro-layout';
import dynamicMenus from './dynamic-menus';

export type TAppInitial = {
  menus: MenuDataItem[];
};

const menus: MenuDataItem[] = [
  {
    path: '/welcome',
    name: '欢迎',
  },
  {
    path: '/dynamic',
    name: '动态调试路由',
    children: dynamicMenus,
  },
  {
    path: '/dev',
    name: '开发中',
    children: [],
  },
  {
    path: '/devmanager',
    name: '开发管理',
    children: [
      {
        path: '/devmanager/descriptdata',
        name: '实体建模',
      },
      {
        path: '/devmanager/ComponentDTO',
        name: '出入参建模',
      },
      {
        path: '/devmanager/ComponentData',
        name: '组件建模',
      },
      {
        path: '/devmanager/AttributeType',
        name: '数据类型配置',
      },
      {
        path: '/devmanager/Commonattribute',
        name: '公共属性',
      },
      {
        path: '/devmanager/CodeEditor',
        name: '模板代码查看',
      },
      {
        path: '/factory',
        name: '前端工厂',
        children: [
          {
            path: '/devmanager/MainFactory',
            name: '页面工厂',
          },
          {
            path: '/devmanager/factory/units/Query',
            name: '查询建模',
          },
          {
            path: '/devmanager/factory/units/Form',
            name: '表单建模',
          },
          {
            path: '/devmanager/factory/units/Tree',
            name: '树建模',
          },
          {
            path: '/devmanager/factory/units/Action',
            name: '按钮',
          },
          {
            path: '/devmanager/factory/units/Custom',
            name: '自定义建模',
          },
        ],
      },
    ],
  },
  {
    path: '/sys',
    name: '用户权限（开发中）',
    children: [
      {
        path: '/sys/Menu',
        name: '系统菜单',
      },
      {
        path: '/sys/Roleagg',
        name: '角色聚合',
      },
      {
        path: '/sys/Useragg',
        name: '系统用户聚合',
      },
      {
        path: '/sys/SysToken',
        name: 'Token管理',
      },
    ],
  },
  {
    path: '/client',
    name: '客户端配置',
    children: [
      {
        path: '/client/programconf',
        name: '客户端配置',
      },
    ],
  },
];

export default menus;
