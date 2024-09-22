import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrintError } from '../../../components/errors/print-error.component';
import Ambulances from '../../../services/Ambulance';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-login',
    templateUrl: './ambulance.component.html',
    styleUrls: ['./ambulance.component.scss'],
    standalone: true,
    imports: [DataTablesModule, ReactiveFormsModule, PrintError, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, CommonModule]
})
export class AmbulanceComponent implements OnInit {
  loading: boolean = true;
  ambulances: any[] = [];
  currentAmbulance: any = null;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: Config = {};

  ambulanceForm = new FormGroup({
    vehicleNo: new FormControl('', Validators.required),
  });

  constructor(private ambulance: Ambulances, private router: Router) { }

  ngOnInit(): void {
    this.reload();
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

  remove(id: number) {
    this.ambulance.remove(id).subscribe(() => {
      this.reload();
    });
  }

  load(id: number) {
    this.ambulance.getById(id).subscribe(d => {
      this.currentAmbulance = d;
      this.ambulanceForm.setValue({
        vehicleNo: d.vehicleNumber
      });
    });
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  reload() {
    this.currentAmbulance = null;
    this.ambulance.all().subscribe(d => {
      this.ambulances = d;
      this.dtTrigger.next(d);
    });
  }

  save() {
    if (this.currentAmbulance != null) {
      this.ambulance.update(this.currentAmbulance.id, this.ambulanceForm.controls.vehicleNo.value!        ).subscribe(r => {
          this.reload();
          this.ambulanceForm.reset();
        });
    }
    else {
      this.ambulance.add(this.ambulanceForm.controls.vehicleNo.value!
        ).subscribe(r => {
          this.reload();
          this.ambulanceForm.reset();
        });
    }
  }
}
