import { Injectable } from '@angular/core';
import HttpService from './HttpService';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export default class Ambulances {
    constructor(private http: HttpService) {

    }

    all(): Observable<any> {
        return this.http.client.get(this.http.URL + 'ambulances');
    }

    remove(id: number) {
        return this.http.client.delete(this.http.URL + 'ambulances/' + id);
    }

    getById(id: number): Observable<any> {
        return this.http.client.get(this.http.URL + 'ambulances/' + id);
    }

    add(vehicleNo: string) {
        return this.http.client.post(this.http.URL + 'ambulances', {
            vehicleNumber: vehicleNo
        });
    }

    update(id: number, vehicleNo: string) {
        return this.http.client.patch(this.http.URL + 'ambulances/' + id, {
            vehicleNumber: vehicleNo,
        });
    }
}