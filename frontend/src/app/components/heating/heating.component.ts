import { AfterViewInit, Component, Input } from '@angular/core';
import { HeatingConfig } from '../../types/heating.type';
import { MqttService } from '../../services/mqtt/mqtt.service';
import { CommandService } from '../../services/command/command.service';
import { filter, map } from 'rxjs';
import { HeatingPayload, Message } from '../../types/message.type';

@Component({
    selector: 'app-heating',
    templateUrl: './heating.component.html',
    styleUrl: './heating.component.scss'
})
export class HeatingComponent implements AfterViewInit {
    
    @Input() config!: HeatingConfig;
    
    state$ = this.mqttService.live
        .pipe(
            filter(
                (message) => {
                    return message.topic == this.config.mqttTopic;
                }
            ),
            map(
                (message) => {
                    return {
                        topic: message.topic,
                        payload: JSON.parse(message.payload),
                    } as Message<HeatingPayload>;
                }
            ),
        );
    
    constructor(
        private mqttService: MqttService,
        private commandService: CommandService,
    ) { }
    
    ngAfterViewInit(): void {
        this.sendStatusUpdate();
    }

    sendStatusUpdate() {
        this.commandService
            .sendCommand({
                topic: `${this.config.mqttTopic}/command`,
                payload: 'status_update',
            })
            .subscribe();
    }

    sendState(message: Message<HeatingPayload>, state: boolean) {
        this.commandService
            .sendCommand({
                topic: this.config.mqttTopic,
                payload: JSON.stringify({
                    ...message.payload,
                    state: state,
                } as HeatingPayload),
            }, true)
            .subscribe();
    }
    
    sendTemperature(message: Message<HeatingPayload>, increment: number) {
        this.commandService
            .sendCommand({
                topic: this.config.mqttTopic,
                payload: JSON.stringify({
                    ...message.payload,
                    target_temperature: message.payload.target_temperature += increment,
                } as HeatingPayload),
            }, true)
            .subscribe();
    }

}
