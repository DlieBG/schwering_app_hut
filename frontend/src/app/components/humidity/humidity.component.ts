import { AfterViewInit, Component, Input } from "@angular/core";
import { HumidityConfig } from "../../types/humidity.type";
import { filter, map } from "rxjs";
import { HumidityPayload, Message } from "../../types/message.type";
import { MqttService } from "../../services/mqtt/mqtt.service";
import { CommandService } from "../../services/command/command.service";

@Component({
    selector: "app-humidity",
    templateUrl: "./humidity.component.html",
    styleUrl: "./humidity.component.scss",
})
export class HumidityComponent implements AfterViewInit {
    @Input() config!: HumidityConfig;

    humidity$ = this.mqttService.live.pipe(
        filter((message) => {
            return (
                message.topic ==
                `${this.config.mqttPrefix}/status/${this.config.mqttSuffix}`
            );
        }),
        map((message) => {
            return {
                topic: message.topic,
                payload: JSON.parse(message.payload),
            } as Message<HumidityPayload>;
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
                topic: `${this.config.mqttPrefix}/command/${this.config.mqttSuffix}`,
                payload: "status_update",
            })
            .subscribe();
    }
}
