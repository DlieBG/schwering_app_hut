import { AfterViewInit, Component, Input } from "@angular/core";
import { MqttService } from "../../services/mqtt/mqtt.service";
import { HeatingPayload, Message } from "../../types/message.type";
import { filter, map } from "rxjs";
import { HeatingConfig } from "../../types/heating.type";
import { CommandService } from "../../services/command/command.service";

@Component({
    selector: "app-status-heating",
    templateUrl: "./status-heating.component.html",
    styleUrl: "./status-heating.component.scss",
})
export class StatusHeatingComponent implements AfterViewInit {
    @Input() config!: HeatingConfig;

    state$ = this.mqttService.live.pipe(
        filter((message) => {
            return message.topic == this.config.mqttTopic;
        }),
        map((message) => {
            return {
                topic: message.topic,
                payload: JSON.parse(message.payload),
            } as Message<HeatingPayload>;
        }),
    );

    constructor(
        private mqttService: MqttService,
        private commandService: CommandService,
    ) {}

    ngAfterViewInit(): void {
        this.sendStatusUpdate();

        setTimeout(() => {
            this.sendStatusUpdate();
        }, 1000);
    }

    sendStatusUpdate() {
        this.commandService
            .sendCommand({
                topic: `${this.config.mqttTopic}/command`,
                payload: "status_update",
            })
            .subscribe();
    }
}
