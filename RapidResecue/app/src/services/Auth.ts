import { Injectable } from '@angular/core';
import HttpService from './HttpService';
import { Observable } from 'rxjs';

type LoginResponse = {
    id: number,
    email: string,
    role: string,
}

@Injectable({
    providedIn: 'root',
})
export default class AuthService {
    public user: LoginResponse | null | undefined;

    constructor(private http: HttpService) {
        let user = localStorage.getItem('user');

        if (user != null) {
            this.user = JSON.parse(user) as LoginResponse;
        }
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.client.post(this.http.URL + 'auth/login', {
            email, password
        }) as Observable<LoginResponse>;
    }

    register(email: String, password: String): Observable<LoginResponse> {
        return this.http.client.post(this.http.URL + 'auth/signup', {
            Email: email, Password: password
        }) as Observable<LoginResponse>;
    }

    isLoggedIn() {
        return this.user != null;
    }

    getUser(): LoginResponse {
        if (this.user == null) {
            throw new Error("LoginResponse.getUser: User isn't logged in");
        }

        return this.user;
    }

    setUser(user: LoginResponse) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    logout() {
        this.user = null;
        this.http.router.navigate(['login']);
        localStorage.removeItem('user');
    }
}