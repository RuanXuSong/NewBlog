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
        path: '*',
        component: './404',
      },
    ],
  },
];
