import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import HttpService from './HttpService';
import Auth from './Auth';

export type Booking = {
    id: number,
    bookedAt: Date,
    pickupAt: Date | undefined,
    status: string,
}

@Injectable({
    providedIn: 'root',
})
export class Bookings {
    constructor(private http: HttpService, private auth: Auth) {

    }
    all(): Observable<Booking[]> {
        return of([
            {id: 1, bookedAt: new Date(2024, 9, 17, 14, 12, 0), pickupAt: new Date(2024, 9, 17, 15, 1, 0), status: 'Completed'} as Booking
        ]);
    }

    status(id: number, status: string) {
        return this.http.client.patch(this.http.URL + 'bookings/status/' + id + '/' + status, {}) as Observable<any>;
    }
    
    pending(): Observable<any[]> {
        return this.http.client.get(this.http.URL + 'bookings/admin') as Observable<any[]>;
    }

    pendingDriver(): Observable<any> {
        return this.http.client.get(this.http.URL + 'bookings/driver/' + this.auth.getUser().id) as Observable<any>;
    }

    add(contact: string, hospital: string, address: string, emergency: boolean) {
        return this.http.client.post(this.http.URL + 'bookings', {
            contact,
            hospital,
            address,
            emergency,
            status: 'Pending',
            patientId: this.auth.getUser().id,
        });
    }

    dispatch(bookingId: number, ambulanceId: number, driverId: number): Observable<any> {
        return this.http.client.post(`${this.http.URL}bookings/dispatch/${bookingId}/${ambulanceId}/${driverId}`, {});
    }
}