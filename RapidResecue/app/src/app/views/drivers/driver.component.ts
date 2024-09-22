import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrintError } from '../../../components/errors/print-error.component';
import Drivers from '../../../services/Drivers';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.scss'],
    standalone: true,
    imports: [DataTablesModule, ReactiveFormsModule, PrintError, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, CommonModule]
})
export class DriverComponent implements OnInit {
  loading: boolean = true;
  drivers: any[] = [];
  currentDriver: any = null;

  dtOptions: Config = {};

  driverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private driver: Drivers, private router: Router) {
  }

  ngOnInit(): void {
    this.reloadDrivers();
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

  removeDriver(id: number) {
    this.driver.remove(id);
  }

  loadDriver(id: number) {
    this.driver.getById(id).subscribe(d => {
      this.currentDriver = d;
      this.driverForm.setValue({
        email: d.email,
        name: d.phoneNumber,
        password: '',
      });
    });
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  reloadDrivers() {
    this.currentDriver = null;
    this.driver.all().subscribe(d => {
      this.drivers = d;
      this.dtTrigger.next(d);
    });
  }

  saveDriver() {
    if (this.currentDriver != null) {
      this.driver.updateDriver(this.currentDriver.id, this.driverForm.controls.name.value!,
        this.driverForm.controls.email.value!,
        this.driverForm.controls.password.value!
        ).subscribe(r => {
          this.reloadDrivers();
          this.driverForm.reset();
        });
    }
    else {
      this.driver.addDriver(this.driverForm.controls.name.value!,
        this.driverForm.controls.email.value!,
        this.driverForm.controls.password.value!
        ).subscribe(r => {
          this.router.navigate(['dashboard/drivers']);
          this.reloadDrivers();
          this.driverForm.reset();
        });
    }
  }
}
