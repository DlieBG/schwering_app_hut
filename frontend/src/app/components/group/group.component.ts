import { Component, Input } from '@angular/core';
import { GroupConfig } from '../../types/group.type';
import { SwitchConfig } from '../../types/switch.type';
import { CommandService } from '../../services/command/command.service';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrl: './group.component.scss'
})
export class GroupComponent {

    @Input() config!: GroupConfig;

    constructor(
        private commandService: CommandService,
    ) { }

    allOn() {
        this.setState(this.config.switchs, true);
    }

    allOff() {
        this.setState(this.config.switchs, false);
    }

    setState(switchs: SwitchConfig[], state: boolean) {
        for (let switchConfig of switchs) {
            this.commandService
                .sendCommand({
                    topic: `${switchConfig.mqttPrefix}/command/${switchConfig.mqttSuffix}`,
                    payload: state ? 'on' : 'off',
                })
                .subscribe();
        }
    }

}
