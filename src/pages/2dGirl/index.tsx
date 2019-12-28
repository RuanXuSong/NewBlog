import React, { useEffect } from 'react';
import { L2Dwidget } from 'live2d-widget';
import Link from 'umi/link';

const Girls = () => {
  useEffect(() => {
    L2Dwidget.init({
      model: {
        jsonPath: 'https://unpkg.com/live2d-widget-model-shizuku/assets/shizuku.model.json',
        scale: 1,
      },
      display: {
        position: 'right', //看板娘的表现位置
        width: 150, //小萝莉的宽度
        height: 300, //小萝莉的高度
        hOffset: 0,
        vOffset: -20,
      },
      mobile: {
        show: false,
      },
      react: {
        opacityDefault: 0.7,
        opacityOnHover: 0.2,
      },
      dialog: {},
    });
    return () => {
      document.getElementById('live2d-widget')!.style.display = 'none';
    };
  });
  return <Link to="/homepage">homepage</Link>;
};

export default Girls;
