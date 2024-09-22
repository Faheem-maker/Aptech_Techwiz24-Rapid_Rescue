import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import Hospitals, { Hospital } from "src/services/Hospitals";
import {Booking, Bookings } from "src/services/Bookings";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrintError } from '@docs-components/errors/print-error.component';
import { Router } from '@angular/router';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { SafePipe } from 'safe-pipe';
import { DataTablesModule } from "angular-datatables";

@Component({
    selector: 'app-login',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
    standalone: true,
    imports: [DataTablesModule, SafePipe, PrintError, ReactiveFormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, CommonModule]
})
export class BookingComponent implements OnInit {
  loading: boolean = true;
  hospitals: Hospital[] = [];
  bookings: Booking[] = [];
  mapUrl: SafeResourceUrl = '';

  bookingForm = new FormGroup({
    contact: new FormControl('', Validators.required),
    hospital: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required]),
    emergency: new FormControl(false)
  });

  constructor(private sanatizer: DomSanitizer, private hospitalService: Hospitals, private bookingService: Bookings, private router: Router) { }

  ngOnInit(): void {
    this.hospitalService.all().subscribe((hospitals) => this.hospitals = hospitals);
    this.bookingService.all().subscribe((bookings) => this.bookings = bookings);
  }

  map() {
    this.mapUrl = this.sanatizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?width=100%&height=300&hl=en&q=' + (this.bookingForm.controls['address'].value ?? '') + '&t=&z=14&ie=UTF8&iwloc=B&output=embed');
  }

  save() {
    this.bookingService.add(this.bookingForm.controls.contact.value!,
      this.bookingForm.controls.hospital.value!,
      this.bookingForm.controls.address.value!,
      this.bookingForm.controls.emergency.value!).subscribe(r => {
        this.router.navigate(['dashboard']);
      });
  }

  formatDate(date: Date) {
    const pad = (num: number) => String(num).padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
}
