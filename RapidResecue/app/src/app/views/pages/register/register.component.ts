import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {ReactiveFormsModule, Validators, FormGroup, FormControl, AbstractControl} from '@angular/forms';
import { PrintError } from '../../../../components/errors/print-error.component';
import AuthService from '../../../../services/Auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [PrintError, ReactiveFormsModule, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    rePassword: new FormControl(''),
  },
  {
    validators: this.ConfirmedValidator('password', 'rePassword'),
  }
  );
  constructor(private auth: AuthService, private router: Router) { }

  register() {
    this.auth.register(this.registerForm.controls['email'].value!, this.registerForm.controls['password'].value!)
      .subscribe(r => {
        this.auth.setUser(r);
        this.router.navigate(['dashboard']);
      }, err => {
        if (this.registerForm.controls['email'].errors) {
          this.registerForm.controls['email'].errors['register'] = 'Unable to register, please trz again';
        }
      });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmation']) {
          return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmation: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }
}
