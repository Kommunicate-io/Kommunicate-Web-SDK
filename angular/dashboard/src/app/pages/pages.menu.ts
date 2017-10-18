export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'Integration',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'editors',
        data: {
          menu: {
            title: 'Chat',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 100,
          }
        }
      },
      {
        path: 'components',
        data: {
          menu: {
            title: 'Bot',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 250,
          }
        }
      },
     {
        path: 'forms',
        data: {
          menu: {
            title: 'Analytics',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 250,
          }
        }        
      },
    {
        path: 'login',
        data: {
          menu: {
            title: 'Agent',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 250,
          }
        }
      },
    ]
  }
];
