import { Injectable } from '@angular/core';
import HttpService from './HttpService';
import Auth from './Auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export default class MedicalHistory {
    constructor(private http: HttpService, private auth: Auth) {

    }

    all(id: number | null = null): Observable<any> {
        return this.http.client.get(this.http.URL + 'medicalHistory/user/' + (id ?? this.auth.getUser().id));
    }

    remove(id: number) {
        return this.http.client.delete(this.http.URL + 'medicalHistory/' + id);
    }

    getById(id: number): Observable<any> {
        return this.http.client.get(this.http.URL + 'medicalHistory/' + id);
    }

    add(type: string, description: string, date: Date) {
        return this.http.client.post(this.http.URL + 'medicalHistory', {
            type,
            description,
            date,
            patientId: this.auth.getUser().id,
        });
    }

    update(id: number, type: string, description: string, date: Date) {
        return this.http.client.patch(this.http.URL + 'medicalHistory/' + id, {
            type,
            description,
            date,
            patientId: this.auth.getUser().id,
        });
    }
}