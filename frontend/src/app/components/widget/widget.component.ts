import { Component } from '@angular/core';
import { SwitchConfig } from '../../types/switch.type';
import { CommandService } from '../../services/command/command.service';
import { HeatingConfig } from '../../types/heating.type';
import { HeatingPayload } from '../../types/message.type';

@Component({
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrl: './widget.component.scss'
})
export class WidgetComponent {

    rows: SwitchConfig[][] = [
        [
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:1', name: 'links' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:2', name: 'rechts' },
        ],
        [
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:3', name: 'vorne links' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:4', name: 'hinten links' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:5', name: 'hinten rechts' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:6', name: 'vorne rechts' },
        ],
        [
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:7', name: 'links' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:8', name: 'mitte' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:9', name: 'rechts' },
        ],
        [
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:12', name: 'Stern links' },
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:14', name: 'Stern rechts' },
        ],
        [
            { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:10', name: 'Sprudelstein' },
        ],
    ];
    
    heating: HeatingConfig = {
        mqttTopic: 'huette/heizung/steuerung',
        temperatureConfig: {
            mqttPrefix: 'huette/heizung',
            mqttSuffix: 'temperature:100',
        },
        humidityConfig: {
            mqttPrefix: 'huette/heizung',
            mqttSuffix: 'humidity:100',
        },
        switchConfig: {
            mqttPrefix: 'huette/heizung',
            mqttSuffix: 'switch:1',
            name: 'Steuerung',
        },
        inputConfig: {
            mqttPrefix: 'huette/heizung',
            mqttSuffix: 'input:100',
        },
    };

    constructor(
        private commandService: CommandService,
    ) { }

    allOff() {
        for (let row of this.rows) {
            for (let switchConfig of row) {
                this.commandService
                    .sendCommand({
                        topic: `${switchConfig.mqttPrefix}/command/${switchConfig.mqttSuffix}`,
                        payload: 'off',
                    })
                    .subscribe();
            }
        }
        
        this.commandService
            .sendCommand({
                topic: this.heating.mqttTopic,
                payload: JSON.stringify({
                    state: false,
                    target_temperature: 18,
                } as HeatingPayload),
            }, true)
            .subscribe();
    }

}
