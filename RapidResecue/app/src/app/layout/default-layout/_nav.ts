import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import AuthService from 'src/services/Auth';

export function navItems(auth: AuthService, router: Router): INavData[] {
  if (!auth.isLoggedIn()) {
    router.navigate(['login']);
  }
  var nav: INavData[] = [];
  if (auth.getUser().role == "Admin") {
    nav = [
      {
        name: 'Drivers',
        url: '/dashboard/drivers',
        iconComponent: { name: 'cil-user' },
      },
      {
        name: 'Ambulance',
        url: '/dashboard/ambulances',
        iconComponent: { name: 'cil-truck' },
      },
    ];
  }
  else if (auth.getUser().role == "Patient") {
    nav = [
      {
        name: 'Medical Profile',
        url: '/dashboard/medical-history',
        iconComponent: { name: 'cil-user' },
      },
    ];
  }

  return [
    {
      name: 'Dashboard',
      url: '/dashboard',
      iconComponent: { name: 'cil-speedometer' },
    },
    ...nav,
    {
      name: 'Logout',
      url: '/logout',
      iconComponent: { name: 'cil-menu' },
    },
  ];
}
