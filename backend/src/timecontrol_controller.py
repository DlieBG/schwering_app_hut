from actors.switch import Switch
import paho.mqtt.client as mqtt
from datetime import datetime
from time import sleep
import asyncio, json

class TimecontrolController():
    def __init__(self, mqtt_client: mqtt.Client, mqtt_topic: str, switch: Switch):
        self.mqtt_client = mqtt_client
        self.mqtt_topic = mqtt_topic
        self.switch = switch

        self.state = False
        self.start_time = '00:00'
        self.end_time = '00:00'

        asyncio.get_running_loop().run_in_executor(
            None, self.__start_update_loop
        )

    def __start_update_loop(self):
        while True:
            self.update()
            sleep(10)

    async def event(self, message):
        if message.topic == self.mqtt_topic:
            payload = json.loads(message.payload)
            self.state = payload.get('state', self.state)
            self.start_time = payload.get('start_time', self.start_time)
            self.end_time = payload.get('end_time', self.end_time)

            self.update()

        if message.topic == f'{self.mqtt_topic}/command':
            if message.payload.decode('utf-8') == 'status_update':
                self.__status_update()

    def __send_status(self, status: dict):
        self.mqtt_client.publish(
            topic=self.mqtt_topic,
            payload=json.dumps(status),
        )

    def __status_update(self):
        self.__send_status({
            'state': self.state,
            'start_time': self.start_time,
            'end_time': self.end_time,
        })

    def __get_desired_state(self) -> bool:
        try:
            now = datetime.now().time()
            start_time = datetime.strptime(self.start_time, '%H:%M').time()
            end_time = datetime.strptime(self.end_time, '%H:%M').time()

            if start_time < end_time:
                return start_time <= now <= end_time
            else:
                # timespan over night
                return now >= start_time or now <= end_time
        except:
            # parsing exceptions
            return False

    def update(self):
        if self.state:
            if self.__get_desired_state():
                self.switch.on()
            else:
                self.switch.off()
