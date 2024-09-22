import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import AuthService from 'src/services/Auth';
import { PrintError } from '@docs-components/errors/print-error.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [PrintError, ReactiveFormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  error: string = '';

  constructor(private router: Router, private auth: AuthService) { }

  registerPage() {
    this.router.navigate(['register']);
  }

  login() {
    console.log("Login:", this.loginForm.controls['email'].value!, this.loginForm.controls['password'].value!);
    this.auth.login(this.loginForm.controls['email'].value!, this.loginForm.controls['password'].value!)
      .subscribe(u => {
        this.auth.setUser(u);
        this.router.navigate(['dashboard']);
      }, err => {
        this.error = 'Incorrect email / password';
      });
  }
}
