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
