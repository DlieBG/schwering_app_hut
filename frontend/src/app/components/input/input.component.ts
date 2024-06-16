import { AfterViewInit, Component, Input } from '@angular/core';
import { filter, map } from 'rxjs';
import { InputPayload, Message } from '../../types/message.type';
import { MqttService } from '../../services/mqtt/mqtt.service';
import { InputConfig } from '../../types/input.type';
import { CommandService } from '../../services/command/command.service';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent implements AfterViewInit {
    
    @Input() config!: InputConfig;

    state$ = this.mqttService.live
        .pipe(
            filter(
                (message) => {
                    return message.topic == `${this.config.mqttPrefix}/status/${this.config.mqttSuffix}`;
                }
            ),
            map(
                (message) => {
                    return {
                        topic: message.topic,
                        payload: JSON.parse(message.payload),
                    } as Message<InputPayload>;
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
                topic: `${this.config.mqttPrefix}/command/${this.config.mqttSuffix}`,
                payload: 'status_update',
            })
            .subscribe();
    }

}
