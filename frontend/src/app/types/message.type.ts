export interface Message<P> {
    topic: string;
    payload: P;
}

export interface SwitchPayload {
    output: boolean;
}

export interface TimecontrolPayload {
    state: boolean;
    start_time: string;
    end_time: string;
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
