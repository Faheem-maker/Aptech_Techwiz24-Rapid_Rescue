import { Injectable } from '@angular/core';
import HttpService from './HttpService';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export default class Drivers {
    constructor(private http: HttpService) {

    }

    all(): Observable<any> {
        return this.http.client.get(this.http.URL + 'auth/drivers');
    }

    remove(id: number) {
        return this.http.client.delete(this.http.URL + 'auth/user/' + id);
    }

    getById(id: number): Observable<any> {
        return this.http.client.get(this.http.URL + 'auth/user/' + id);
    }

    addDriver(name: string, email: string, password: string) {
        return this.http.client.post(this.http.URL + 'auth/create-driver', {
            email,
            password: password == "" ? "null" : password,
            phoneNumber: name,
            role: "Driver",
        });
    }

    updateDriver(id: number, name: string, email: string, password: string) {
        return this.http.client.patch(this.http.URL + 'auth/user/' + id, {
            email,
            password: password == "" ? "null" : password,
            phoneNumber: name,
            role: "Driver",
        });
    }
}