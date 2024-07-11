import { AfterViewInit, Component, Input } from "@angular/core";
import { TemperatureConfig } from "../../types/temperature.type";
import { MqttService } from "../../services/mqtt/mqtt.service";
import { CommandService } from "../../services/command/command.service";
import { filter, map } from "rxjs";
import { Message, TemperaturePayload } from "../../types/message.type";

@Component({
    selector: "app-temperature",
    templateUrl: "./temperature.component.html",
    styleUrl: "./temperature.component.scss",
})
export class TemperatureComponent implements AfterViewInit {
    @Input() config!: TemperatureConfig;

    temperature$ = this.mqttService.live.pipe(
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
            } as Message<TemperaturePayload>;
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
