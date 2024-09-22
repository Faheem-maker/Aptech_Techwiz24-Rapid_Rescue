import { Router } from '@angular/router';
import AuthService from '../../../../services/Auth';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    template: '',
})
export class LogoutComponent {
    constructor(router: Router, auth: AuthService) {
        // auth.logout();
        router.navigateByUrl('/assets/home.html');
    }
}