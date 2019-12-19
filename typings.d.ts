/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-11-08 14:50:47
 * @LastEditors  : 阮旭松
 * @LastEditTime : 2019-12-19 17:47:39
 */
declare module '*.css';
declare module '*.png';
declare module '*.less';

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

interface ThemeSettingConfig {
  theme: object; // 对应配置的theme-config.js文件
  templateCss: string; // 对应按需抽离出来的样式模版
  generate: (color: string) => void; // antd的color计算逻辑 会在change的时候自动调用
  change: (key?: string, config?: object) => void; // 切换主题方法 通过主题key或自定义新增配置
  init: () => void; // 初始化函数 会在项目第一次加载的时候自动调用 设置主题key为default
}

declare let themeSetting: ThemeSettingConfig;
