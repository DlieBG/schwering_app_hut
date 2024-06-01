import { Component } from '@angular/core';
import { GroupConfig } from '../../types/group.type';
import { CommandService } from '../../services/command/command.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    groups: GroupConfig[] = [
        {
            switchs: [
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:1', name: 'links' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:2', name: 'rechts' },
            ],
            name: 'Deckenlampen',
        },
        {
            switchs: [
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:3', name: 'vorne links' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:4', name: 'hinten links' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:5', name: 'hinten rechts' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:6', name: 'vorne rechts' },
            ],
            name: 'Seitenlampen',
        },
        {
            switchs: [
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:7', name: 'links' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:8', name: 'mitte' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:9', name: 'rechts' },
            ],
            name: 'Außenlampen',
        },
        {
            switchs: [
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:12', name: 'Stern links' },
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:14', name: 'Stern rechts' },
            ],
            name: 'Weihnachtsbeleuchtung',
        },
        {
            switchs: [
                { mqttPrefix: 'huette/rpi', mqttSuffix: 'switch:10', name: 'Sprudelstein' },
            ],
            name: 'Seitenlampen außen',
        },
    ];

    constructor(
        private commandService: CommandService,
    ) { }

    allOff() {
        for (let group of this.groups) {
            for (let switchConfig of group.switchs) {
                this.commandService
                    .sendCommand({
                        topic: `${switchConfig.mqttPrefix}/command/${switchConfig.mqttSuffix}`,
                        payload: 'off',
                    })
                    .subscribe();
            }
        }
    }

}
