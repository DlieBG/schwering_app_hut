import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MqttService } from '../../services/mqtt/mqtt.service';
import { filter, map } from 'rxjs';
import { Message, SwitchPayload } from '../../types/message.type';
import { CommandService } from '../../services/command/command.service';
import { SwitchConfig } from '../../types/switch.type';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrl: './switch.component.scss'
})
export class SwitchComponent implements AfterViewInit {

    @Input() config!: SwitchConfig;

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
                    } as Message<SwitchPayload>;
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
    
    sendState(state: boolean) {
        this.commandService
            .sendCommand({
                topic: `${this.config.mqttPrefix}/command/${this.config.mqttSuffix}`,
                payload: state ? 'on' : 'off',
            })
            .subscribe();
    }

    sendToggle() {
        this.commandService
            .sendCommand({
                topic: `${this.config.mqttPrefix}/command/${this.config.mqttSuffix}`,
                payload: 'toggle',
            })
            .subscribe();
    }

}
