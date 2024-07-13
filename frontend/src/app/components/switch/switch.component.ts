import { AfterViewInit, Component, Input } from "@angular/core";
import { MqttService } from "../../services/mqtt/mqtt.service";
import { filter, map, startWith, tap } from "rxjs";
import {
    Message,
    SwitchPayload,
    TimecontrolPayload,
} from "../../types/message.type";
import { CommandService } from "../../services/command/command.service";
import { SwitchConfig } from "../../types/switch.type";

@Component({
    selector: "app-switch",
    templateUrl: "./switch.component.html",
    styleUrl: "./switch.component.scss",
})
export class SwitchComponent implements AfterViewInit {
    @Input() config!: SwitchConfig;

    switchDisabled: boolean = false;

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

    timecontrolState$ = this.mqttService.live.pipe(
        filter((message) => {
            return (
                !!this.config.timecontrol &&
                message.topic == this.config.timecontrol
            );
        }),
        map((message) => {
            return {
                topic: message.topic,
                payload: JSON.parse(message.payload),
            } as Message<TimecontrolPayload>;
        }),
        tap((timecontrolState) => {
            this.switchDisabled = timecontrolState.payload.state;
        }),
        startWith(null),
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

        if (this.config.timecontrol)
            this.commandService
                .sendCommand({
                    topic: `${this.config.timecontrol}/command`,
                    payload: "status_update",
                })
                .subscribe();
    }

    sendState(state: boolean) {
        this.commandService
            .sendCommand({
                topic: `${this.config.mqttPrefix}/command/${this.config.mqttSuffix}`,
                payload: state ? "on" : "off",
            })
            .subscribe();
    }

    sendTimecontrolState(message: Message<TimecontrolPayload>, state: boolean) {
        if (this.config.timecontrol)
            this.commandService
                .sendCommand(
                    {
                        topic: this.config.timecontrol,
                        payload: JSON.stringify({
                            ...message.payload,
                            state: state,
                        } as TimecontrolPayload),
                    },
                    true,
                )
                .subscribe();
    }

    sendTimecontrolTimes(message: Message<TimecontrolPayload>) {
        if (this.config.timecontrol)
            this.commandService
                .sendCommand(
                    {
                        topic: this.config.timecontrol,
                        payload: JSON.stringify(message.payload),
                    },
                    true,
                )
                .subscribe();
    }
}
