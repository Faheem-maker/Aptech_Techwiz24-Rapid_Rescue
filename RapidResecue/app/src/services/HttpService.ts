import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export default class HttpService {
    public readonly URL = 'https://localhost:44336/api/';

    constructor (public client: HttpClient, public router: Router) {

    }
}