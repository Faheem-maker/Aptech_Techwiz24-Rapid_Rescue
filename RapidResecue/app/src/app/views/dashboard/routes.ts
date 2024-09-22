import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: $localize`Dashboard`
    }
  },
  {
    path: 'bookings',
    data: {
      title: 'Bookings'
    },
    loadComponent: () => import('./../bookings/booking.component').then(m => m.BookingComponent),
  },
  {
    path: 'drivers',
    data: {
      title: 'Drivers'
    },
    loadComponent: () => import('./../drivers/driver.component').then(m => m.DriverComponent),
  },
  {
    path: 'ambulances',
    data: {
      title: 'Ambulances'
    },
    loadComponent: () => import('./../ambulance/ambulance.component').then(m => m.AmbulanceComponent),
  },
  {
    path: 'medical-history',
    data: {
      title: 'Medical History'
    },
    loadComponent: () => import('./../medical_history/medical_history.component').then(m => m.MedicalHistoryComponent),
  }
];

