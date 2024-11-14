const fs = require('fs');
const os = require('os');
const path = require('path');

type TRoute = {
  path: string;
  name: string;
  component: string;
  exact: boolean;
  routes?: TRoute[];
};

type TDynamicStore = {
  impStr: string;
  propStr: string;
};

type MenuDataItem = {
  /** @name 子菜单 */
  children?: MenuDataItem[];
  /** @name 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean;
  /** @name 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /** @name 菜单的icon */
  icon?: React.ReactNode;
  /** @name 自定义菜单的国际化 key */
  locale?: string | false;
  /** @name 菜单的名字 */
  name?: string;
  /** @name 用于标定选中的值，默认是 path */
  key?: string;
  /** @name disable 菜单选项 */
  disabled?: boolean;
  /** @name 路径,可以设定为网页链接 */
  path?: string;
  /**
   * 当此节点被选中的时候也会选中 parentKeys 的节点
   *
   * @name 自定义父节点
   */
  parentKeys?: string[];
  /** @name 隐藏自己，并且将子节点提升到与自己平级 */
  flatMenu?: boolean;
  /** @name 指定外链打开形式，同a标签 */
  target?: string;
  [key: string]: any;
};

// 读取pages下的目录，找到带route.json文件目录
const pageDir: string = './src/pages/';
const files = fs.readdirSync(path.join(__dirname, pageDir));
const dynamicRouters: TRoute[] = [];
const dynamicMenus: MenuDataItem[] = [];
files.forEach((item: string) => {
  const stat = fs.statSync(path.join(__dirname, pageDir) + item);
  if (
    stat.isDirectory() === true &&
    fs.existsSync(path.join(__dirname, `${pageDir}${item}/route.json`))
  ) {
    const data = fs.readFileSync(`${pageDir}${item}/route.json`).toString();
    console.log(data.toString());
    const route: TRoute = JSON.parse(data.toString());
    dynamicRouters.push(route);
    dynamicMenus.push({
      path: '/' + route.path,
      name: route.name,
    });
  }
});

// 输出到动态路由文件
const drs = `// 以下文件执行genRoute自动生成，请勿手动修改
export default ${JSON.stringify(dynamicRouters, null, 4)}
`;
fs.writeFile('./config/dynamic-routes.ts', drs, function (err: any) {
  if (err) {
    return console.error(err);
  }
  console.log('动态路由写入成功！');
});

// 输出到动态菜单文件
const dms = `// 以下文件执行genRoute自动生成，请勿手动修改
export default ${JSON.stringify(dynamicMenus, null, 4)}
`;
fs.writeFile('./src/menu/dynamic-menus.ts', dms, function (err: any) {
  if (err) {
    return console.error(err);
  }
  console.log('动态菜单写入成功！');
});

// 读取pages下的目录，找到带store子目录的目录，并且第一行"// dynamic store"
const dynamicStores: TDynamicStore[] = [];
files.forEach(async (item: string) => {
  const stat = fs.statSync(path.join(__dirname, pageDir) + item);
  if (
    stat.isDirectory() === true &&
    fs.existsSync(path.join(__dirname, `${pageDir}${item}/store/index.ts`))
  ) {
    const storeData: string = fs
      .readFileSync(path.join(__dirname, `${pageDir}${item}/store/index.ts`))
      .toString();
    // 是否需要动态导入标志
    let fgDynamicStore: boolean = false;
    if (storeData.includes('\r\n')) {
      const firstLine = storeData.substring(0, storeData.indexOf('\r\n'));
      if (firstLine.includes('// dynamic store')) {
        fgDynamicStore = true;
      }
    } else {
      if (storeData.includes('\n')) {
        const firstLine = storeData.substring(0, storeData.indexOf('\n'));
        if (firstLine.includes('// dynamic store')) {
          fgDynamicStore = true;
        }
      }
      if (storeData.includes('\r')) {
        const firstLine = storeData.substring(0, storeData.indexOf('\r'));
        if (firstLine.includes('// dynamic store')) {
          fgDynamicStore = true;
        }
      }
    }
    if (!fgDynamicStore) {
      return;
    }

    const confData: string = fs
      .readFileSync(path.join(__dirname, `${pageDir}${item}/conf/index.tsx`))
      .toString();

    if (confData.includes('\r\n')) {
      const confDataArr = confData.split('\r\n');
      confDataArr.forEach((cdLine) => {
        // 找到moduleName所在行数据
        const p =
          /export(\s*)const(\s*)moduleName(\s*)=(\s*)['|"](\S*)['|"](;*)/;
        const m = p.exec(cdLine);
        if (m) {
          const moduleName = m[5];
          dynamicStores.push({
            impStr: `import ${moduleName}Reducer from '@/pages/${item}/store';`,
            propStr: `${moduleName}: ${moduleName}Reducer,`,
          });
        }
      });
    } else {
      if (confData.includes('\n')) {
        const confDataArr = confData.split('\n');
        confDataArr.forEach((cdLine) => {
          // 找到moduleName所在行数据
          const p =
            /export(\s*)const(\s*)moduleName(\s*)=(\s*)['|"](\S*)['|"](;*)/;
          const m = p.exec(cdLine);
          if (m) {
            const moduleName = m[5];
            dynamicStores.push({
              impStr: `import ${moduleName}Reducer from '@/pages/${item}/store';`,
              propStr: `${moduleName}: ${moduleName}Reducer,`,
            });
          }
        });
      }
      if (confData.includes('\r')) {
        const confDataArr = confData.split('\r');
        confDataArr.forEach((cdLine) => {
          // 找到moduleName所在行数据
          const p =
            /export(\s*)const(\s*)moduleName(\s*)=(\s*)['|"](\S*)['|"](;*)/;
          const m = p.exec(cdLine);
          if (m) {
            const moduleName = m[5];
            dynamicStores.push({
              impStr: `import ${moduleName}Reducer from '@/pages/${item}/store';`,
              propStr: `${moduleName}: ${moduleName}Reducer,`,
            });
          }
        });
      }
    }
  }
});

const dss = `// 以下文件执行genRoute自动生成，请勿手动修改
${dynamicStores.map((dr) => dr.impStr).join(`${os.EOL}`)}
export default {
  ${dynamicStores.map((dr) => dr.propStr).join(`${os.EOL}  `)}
};
`;
fs.writeFile('./src/store/dynamic-store.ts', dss, function (err: any) {
  if (err) {
    return console.error(err);
  }
  console.log('动态store写入成功！');
});
