/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-12-19 17:50:36
 * @LastEditors  : 阮旭松
 * @LastEditTime : 2019-12-19 17:54:55
 */
import { BaseStore } from '@/interfaces/base.store';
import { MenuItemConfig } from '@/interfaces/common';

const baseStore: BaseStore = {
  menus: [
    {
      name: '首页',
      link: '/',
      icon: 'iconhomepage',
      children: [],
    },
  ],

  // methods
  setMenus(menus: MenuItemConfig[]) {
    this.menus = menus;
  },
};

export default baseStore;
