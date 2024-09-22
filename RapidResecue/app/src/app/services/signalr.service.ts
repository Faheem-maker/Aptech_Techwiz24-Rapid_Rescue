import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import HttpService from '../../services/HttpService';

@Injectable({
  providedIn: 'root'
})
export default class SignalrService {
  private hubConnection: signalR.HubConnection;
  private cb: any;

  constructor (private http: HttpService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(this.http.URL + 'SignalR')
                              .build();
      this.hubConnection
                              .start()
                              .then(() => console.log('Connection started'))
                              .catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.on('Data', (data) => {
      console.log(data);
      this.callback(data);
    });
  }

  setCallback(cb: any) {
    this.cb = cb;
  }

  callback(data: any) {
    if (this.cb != null) {
      this.cb(data);
    }
  }
}
