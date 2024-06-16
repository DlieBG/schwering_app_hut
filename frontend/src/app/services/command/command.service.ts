import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Command } from '../../types/command.type';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    sendCommand(command: Command, retain: boolean = false) {
        return this.httpClient.post('api/command', command, {
            params: {
                retain: retain,
            },
        });
    }

}
