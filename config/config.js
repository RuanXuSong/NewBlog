import routerConfig from './route.config';

export default {
  targets: {
    chrome: 49,
    firefox: 45,
    safari: 10,
    edge: 13,
    ios: 10,
    ie: 10,
  },
  history: 'hash',
  outputPath: './build',
  routes: routerConfig,
  plugins: [
    'umi-plugin-polyfill',
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loading.tsx',
        },
        title: '我的博客',
        dll: false,
        library: 'react',
        pwa: false,
        fastClick: true,
        routes: {
          exclude: [/components\//],
        },
      },
    ],
  ],
  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
  },
  ignoreMomentLocale: true,
  treeShaking: true,
  minimizer: 'terserjs',
  exportStatic: false, // 如果有动态路由，这个地方改成false
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  define: {
    'process.env.PROD': JSON.stringify(false),
  },
};
