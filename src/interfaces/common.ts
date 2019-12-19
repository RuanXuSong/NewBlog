/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-12-19 17:53:16
 * @LastEditors: 阮旭松
 * @LastEditTime: 2019-12-19 17:53:24
 */
export interface MenuItemConfig {
  name: string;
  link?: string;
  icon?: string;
  children?: MenuItemConfig[];
}
