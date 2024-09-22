import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrintError } from '../../../components/errors/print-error.component';
import MedicalHistory from '../../../services/MedicalHistory';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './medical_history.component.html',
    styleUrls: ['./medical_history.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, PrintError, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, CommonModule]
})
export class MedicalHistoryComponent implements OnInit {
  loading: boolean = true;
  histories: any[] = [];
  currentHistory: any = null;

  medicalForm = new FormGroup({
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    date: new FormControl('', [Validators.required, this.dateValidator]) // Custom date validator
  });

  dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const dateString = control.value;
    if (!dateString) {
      return null; // Allow empty value for date
    }
  
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const isValid = regex.test(dateString);
  
    return isValid ? null : { 'date': true };
  }

  constructor(private history: MedicalHistory, private router: Router) { }

  ngOnInit(): void {
    this.reload();
  }

  formatDate(date: string) {
    var parsed = new Date(date);
    const pad = (num: number) => String(num).padStart(2, '0');
    
    const year = parsed.getFullYear();
    const month = pad(parsed.getMonth() + 1); // Months are zero-indexed
    const day = pad(parsed.getDate());
    
    return `${year}-${month}-${day}`;
  }

  remove(id: number) {
    this.history.remove(id)
      .subscribe(() => {
        this.reload();
      });
  }

  load(id: number) {
    this.history.getById(id).subscribe(d => {
      this.currentHistory = d;
      this.medicalForm.setValue({
        type: d.type,
        description: d.description,
        date: this.formatDate(d.date),
      });
    });
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  reload() {
    this.currentHistory = null;
    this.history.all().subscribe(d => this.histories = d);
  }

  save() {
    if (this.currentHistory != null) {
      this.history.update(this.currentHistory.id, this.medicalForm.controls.type.value!,
        this.medicalForm.controls.description.value!,
        new Date(this.medicalForm.controls.date.value!)
        ).subscribe(r => {
          this.reload();
          this.medicalForm.reset();
        });
    }
    else {
      this.history.add(this.medicalForm.controls.type.value!,
        this.medicalForm.controls.description.value!,
        new Date(this.medicalForm.controls.date.value!)
        ).subscribe(r => {
          this.reload();
          this.medicalForm.reset();
        });
    }
  }
}
