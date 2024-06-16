from actors.temperature_sensor import TemperatureSensor
from actors.switch import Switch
import paho.mqtt.client as mqtt
import json

__offset__ = .5

class HeatingController():
    def __init__(self, mqtt_client: mqtt.Client, mqtt_prefix: str, temperature_sensor: TemperatureSensor, switch: Switch):
        self.mqtt_client = mqtt_client
        self.mqtt_prefix = mqtt_prefix
        self.temperature_sensor = temperature_sensor
        self.switch = switch

        self.state = None
        self.target_temperature = None

        @temperature_sensor.update
        def temperature_update(_, temperature):
            self.update_switch()

    async def event(self, message):
        if message.topic == self.mqtt_prefix:
            payload = json.loads(message.payload)
            self.state = payload.get('state', False)
            self.target_temperature = payload.get('target_temperature', 18)

            self.update_switch()

    def update_switch(self):
        if self.state:
            if self.temperature_sensor.temperature:
                if self.temperature_sensor.temperature >= self.target_temperature + __offset__:
                    self.switch.off()
                if self.temperature_sensor.temperature <= self.target_temperature - __offset__:
                    self.switch.on()
            else:
                self.switch.off()
        else:
            self.switch.off()
