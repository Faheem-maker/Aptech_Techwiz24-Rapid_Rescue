import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, NgZone, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import {
  AvatarComponent,
  BadgeModule,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { Router } from '@angular/router';
import AuthService from 'src/services/Auth';
import Drivers from 'src/services/Drivers';
import Ambulances from 'src/services/Ambulance';
import { Bookings } from 'src/services/Bookings';
import { SafePipe } from 'safe-pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import MedicalHistory from 'src/services/MedicalHistory';
import HttpService from 'src/services/HttpService';


interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [SafePipe, ReactiveFormsModule, CommonModule, BadgeModule, WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent],
})
export class DashboardComponent implements OnInit {
  drivers: any[] = [];
  ambulances: any[] = [];
  bookings: any[] = [];
  booking: any | null = null;
  mapUrl: SafeResourceUrl = '';
  lat = 0;
  lon = 0;

  dispatchForm = new FormGroup({
    ambulance: new FormControl(0, [Validators.required]),
    driver: new FormControl(0, [Validators.required]),
  });

  histories: any[] = [];

  difference: number = 0;

  map() {
    this.mapUrl = this.sanatizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?width=100%&height=300&hl=en&q=' + (this.booking.address ?? '') + '&t=&z=14&ie=UTF8&iwloc=B&output=embed');
  }

  formatDate(date: string) {
    var parsed = new Date(date);
    const pad = (num: number) => String(num).padStart(2, '0');
    
    const year = parsed.getFullYear();
    const month = pad(parsed.getMonth() + 1); // Months are zero-indexed
    const day = pad(parsed.getDate());
    
    return `${year}-${month}-${day}`;
  }

  constructor(private ngZone: NgZone, private http: HttpService, private history: MedicalHistory, private sanatizer: DomSanitizer, private router: Router, public auth: AuthService, private bookingService: Bookings, private driver: Drivers, private ambulance: Ambulances) {
  }

  reload() {
    if (this.auth.getUser().role == 'Admin') {
      this.bookingService.pending().subscribe(b => {
        this.booking = b[0];
        this.map();
      });
    }
    else {
      this.bookingService.pendingDriver().subscribe(b => {
        this.booking = b;
        this.map();

        if (this.auth.getUser().role == 'Driver') {
          this.history.all(this.booking.patientId).subscribe(d => this.histories = d);
        }
      });
    }
  }

  ngOnInit(): void {
    this.driver.all().subscribe((d: any) => this.drivers = d);
    this.ambulance.all().subscribe((d: any) => this.ambulances = d);
    this.reload();

    if (this.auth.getUser().role == 'Driver') {
      this.startLocationUpdates();
    }
    else if (this.auth.getUser().role == 'Patient') {
      this.updateDriverLocation();
    }
  }

  dispatch() {
    this.bookingService.dispatch(this.booking.id, this.dispatchForm.controls['ambulance'].value!,
    this.dispatchForm.controls['driver'].value!).subscribe(() => {
      this.reload();
    });
  }

  fetchAndSendLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (this.booking) {
          this.http.client.patch(this.http.URL + 'ambulances/location/' + this.booking.ambulanceId + '/' + latitude + '/' + longitude, {}).subscribe();
        }
      }
    );
  }

  startLocationUpdates() {
    setInterval(() => {
      this.ngZone.run(() => {
        this.fetchAndSendLocation();
      });
    }, 2000); // Fetch every 2 seconds
  }

  showLocation() {
    if (this.booking) {
      this.http.client.get(this.http.URL + 'ambulances/location/' + this.booking.ambulanceId, {}).subscribe((l: any) => {
        if (this.lat != l.lat && this.lon != l.lon) {
          this.mapUrl = this.sanatizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?width=100%&height=300&hl=en&q=' + l.lat + ',' + l.lon + '&t=&z=14&ie=UTF8&iwloc=B&output=embed');

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              this.difference = Math.sqrt(Math.pow(l.lat - latitude, 2) + Math.pow(l.lon - longitude, 2))
            }
          );
        }
      });
    }
  }

  updateDriverLocation() {
    setInterval(() => {
      this.ngZone.run(() => {
        this.showLocation();
      });
    }, 2000); // Fetch every 2 seconds
  }

  updateStatus(status: string) {
    this.bookingService.status(this.booking.id, status)
      .subscribe(() => {
        this.reload();
      });
  }

  addBooking() {
    this.router.navigate(["/dashboard/bookings"]);
  }
}
