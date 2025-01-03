import dynamicRoutes from './dynamic-routes';

export default [
  {
    path: '/login',
    name: '登录',
    component: '@/pages/Login',
  },
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      ...dynamicRoutes,
      {
        path: 'welcome',
        name: '欢迎页',
        component: '@/pages/Welcome',
        exact: true,
      },
      {
        path: 'sys/Menu',
        name: '系统菜单',
        component: '@/pages/Menu',
        exact: true,
      },
      {
        path: 'sys/Roleagg',
        name: '角色聚合',
        component: '@/pages/Roleagg',
        exact: true,
      },
      {
        path: 'sys/Useragg',
        name: '系统用户聚合',
        component: '@/pages/Useragg',
        exact: true,
      },
      {
        path: 'devmanager/descriptdata',
        name: '实体建模',
        component: '@/pages/DescriptData',
        exact: true,
      },
      {
        path: 'devmanager/ComponentDTO',
        name: '出入参建模',
        component: '@/pages/ComponentDTO',
        exact: true,
      },
      {
        path: 'devmanager/ComponentData',
        name: '组件建模',
        component: '@/pages/ComponentData',
        exact: true,
      },
      {
        path: 'devmanager/AttributeType',
        name: '数据类型',
        component: '@/pages/AttributeType',
        exact: true,
      },
      {
        path: 'devmanager/Commonattribute',
        name: '公共属性',
        component: '@/pages/Commonattribute',
        exact: true,
      },
      {
        path: 'devmanager/CodeEditor',
        name: '模板代码查看',
        component: '@/pages/CodeEditor',
        exact: true,
      },
      {
        path: 'devmanager/MainFactory',
        name: '页面工厂',
        component: '@/pages/Factory/Main',
        exact: true,
      },
      {
        path: 'devmanager/factory/units/Query',
        name: '查询建模',
        component: '@/pages/Factory/Units/Query',
        exact: true,
      },
      {
        path: 'devmanager/factory/units/Form',
        name: '表单建模',
        component: '@/pages/Factory/Units/Form',
        exact: true,
      },
      {
        path: 'devmanager/factory/units/Tree',
        name: '树建模',
        component: '@/pages/Factory/Units/Tree',
        exact: true,
      },
      {
        path: 'devmanager/factory/units/Action',
        name: '按钮',
        component: '@/pages/Factory/Units/Action',
        exact: true,
      },
      {
        path: 'devmanager/factory/units/Custom',
        name: '自定义建模',
        component: '@/pages/Factory/Units/Custom',
        exact: true,
      },
      {
        path: 'client/programconf',
        name: '客户端配置',
        component: '@/pages/ProgramConf',
        exact: true,
      },
      {
        path: '*',
        component: '@/pages/P404',
      },
    ],
  },
];
