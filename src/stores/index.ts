/*
 * @文件描述: iceStore
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-12-19 17:45:04
 * @LastEditors  : 阮旭松
 * @LastEditTime : 2019-12-19 17:48:09
 */
import IceStore from '@ice/store';
import baseStore from './base';

const iceStore = new IceStore();
const store = {
  baseStore,
};
Object.keys(store).forEach(key => {
  iceStore.registerStore(key, store[key]);
});

export default iceStore;
