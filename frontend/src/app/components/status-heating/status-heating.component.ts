import { Component } from '@angular/core';
import { MqttService } from '../../services/mqtt/mqtt.service';
import { InputPayload, Message } from '../../types/message.type';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-status-heating',
    templateUrl: './status-heating.component.html',
    styleUrl: './status-heating.component.scss'
})
export class StatusHeatingComponent {

}
