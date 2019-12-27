export default [
  {
    path: '/',
    component: '../layouts/index',
    routes: [
      { path: '/homepage', component: './homepage' },
      {
        path: '/',
        component: './homepage',
      },
      {
        path: '/city',
        component: './city',
      },
      {
        path: '/2dGirl',
        component: './2dGirl',
      },
      {
        path: '*',
        component: './404',
      },
    ],
  },
];
