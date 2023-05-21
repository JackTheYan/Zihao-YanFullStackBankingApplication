import { defineConfig } from 'umi';
import proxy from './proxy';
import routes from './routes';

const { NODE_ENV } = process.env;


export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    immer: false,
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  // node_modules 目录不走babel编译
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  dynamicImport: {},
  // forkTSChecker: {},
//   dynamicImport: {
//     loading: '@/components/PageLoading/index',
//   },
  esbuild: {},
  targets: {
    chrome: 79,
    safari: 10,
    firefox: false,
    edge: false,
    ios: false,
    ie: false,
  },
  routes,
  theme: {
    // 'primary-color': defaultSettings.primaryColor,
    'text-color': '#121212',
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: false,
  proxy,
  manifest: {
    basePath: '/',
  },
  // chunks: NODE_ENV === 'development' ? undefined:  ['vendors', 'commons', 'umi'],
  outputPath: '../server/dist',
  publicPath: '/',
});
