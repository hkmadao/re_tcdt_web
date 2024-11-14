import { defineConfig } from 'umi';
import { resolve } from 'path';
import routes from './routes';

export default defineConfig({
  //二级目录名称
  publicPath: '/tcdt/',
  favicon: '/tcdt/favicon.png',
  nodeModulesTransform: {
    type: 'none',
  },
  alias: {
    components: resolve(__dirname, './src/components'),
  },
  history: {
    type: 'hash',
  },
  // layout: {},
  routes: routes,
  fastRefresh: {},
  title: 'TCTD',
  //开启mfsu项目使用class写法的组件报错
  // mfsu: {},
  webpack5: {
    lazyCompilation: {},
  },
  // dynamicImport: {},
  cssLoader: {
    localsConvention: 'camelCase',
  },
  //开启后如果配置不正确，则build报错
  // exportStatic: {},
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
  },
});
