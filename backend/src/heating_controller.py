from actors.temperature_sensor import TemperatureSensor
from actors.switch import Switch
import paho.mqtt.client as mqtt
import json

__offset__ = .5

class HeatingController():
    def __init__(self, mqtt_client: mqtt.Client, mqtt_topic: str, temperature_sensor: TemperatureSensor, switch: Switch):
        self.mqtt_client = mqtt_client
        self.mqtt_topic = mqtt_topic
        self.temperature_sensor = temperature_sensor
        self.switch = switch

        self.state = False
        self.target_temperature = 18

        @temperature_sensor.update
        def temperature_update(_, temperature):
            self.update_switch()

    async def event(self, message):
        if message.topic == self.mqtt_topic:
            payload = json.loads(message.payload)
            self.state = payload.get('state', self.state)
            self.target_temperature = payload.get('target_temperature', self.target_temperature)

            self.update_switch()

        if message.topic == f'{self.mqtt_topic}/command':
            if message.payload.decode('utf-8') == 'status_update':
                self.__status_update()

    def __send_status(self, status: dict):
        self.mqtt_client.publish(
            topic=self.mqtt_topic,
            payload=json.dumps(status),
        )

    def __status_update(self):
        if self.state is not None:
            self.__send_status({
                'state': self.state,
                'target_temperature': self.target_temperature,
            })

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
