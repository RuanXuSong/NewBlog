/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-12-19 17:53:51
 * @LastEditors  : 阮旭松
 * @LastEditTime : 2019-12-19 17:54:41
 */
import { MenuItemConfig } from './common';

export interface BaseStore {
  menus: MenuItemConfig[];
  setMenus: (menus: MenuItemConfig[]) => void;
}
