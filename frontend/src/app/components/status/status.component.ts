import { AfterViewInit, Component, Input } from "@angular/core";
import { SwitchConfig } from "../../types/switch.type";
import { filter, map } from "rxjs";
import { Message, SwitchPayload } from "../../types/message.type";
import { MqttService } from "../../services/mqtt/mqtt.service";
import { CommandService } from "../../services/command/command.service";

@Component({
    selector: "app-status",
    templateUrl: "./status.component.html",
    styleUrl: "./status.component.scss",
})
export class StatusComponent implements AfterViewInit {
    @Input() config!: SwitchConfig;

    state$ = this.mqttService.live.pipe(
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
            } as Message<SwitchPayload>;
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
