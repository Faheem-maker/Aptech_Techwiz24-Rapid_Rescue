import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

export type Hospital = {
    id: number,
    title: string,
}

@Injectable({
    providedIn: 'root',
})
class Hospitals {
    all(): Observable<Hospital[]> {
        return of([
            {title: 'Hospital 1', id: 1} as Hospital,
            {title: 'Hospital 2', id: 1} as Hospital,
            {title: 'Hospital 3', id: 1} as Hospital,
        ]);
    }
}

export default Hospitals;