import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Message } from '../../types/message.type';

@Injectable({
    providedIn: 'root'
})
export class MqttService {

    live: WebSocketSubject<Message<any>> = webSocket(`ws://${window.location.host}/live`);

}
