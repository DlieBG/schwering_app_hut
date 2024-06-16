export interface Message<P> {
    topic: string;
    payload: P;
}

export interface SwitchPayload {
    output: boolean;
}

export interface InputPayload {
    state: boolean;
}

export interface TemperaturePayload {
    tC: number;
}

export interface HumidityPayload {
    rh: number;
}

export interface HeatingPayload {
    state: boolean;
    target_temperature: number;
}
