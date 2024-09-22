import { Injectable } from '@angular/core';
import HttpService from './HttpService';
import Auth from './Auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export default class NotificationService {
    constructor(private http: HttpService, private auth: Auth) {

    }

    all(): Observable<any> {
        return this.http.client.get(this.http.URL + 'auth/notifications/' + this.auth.getUser().id);
    }

    read() {
        return this.http.client.delete(this.http.URL + 'auth/notifications/' + this.auth.getUser().id);
    }
}