import { HumidityConfig } from "./humidity.type";
import { InputConfig } from "./input.type";
import { SwitchConfig } from "./switch.type";
import { TemperatureConfig } from "./temperature.type";

export interface HeatingConfig {
    mqttTopic: string;
    temperatureConfig: TemperatureConfig;
    humidityConfig: HumidityConfig;
    switchConfig: SwitchConfig;
    inputConfig: InputConfig;
}
