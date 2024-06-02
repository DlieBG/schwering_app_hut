import paho.mqtt.client as mqtt

class Switch():
    def __init__(self, mqtt_client: mqtt.Client, mqtt_prefix: str, mqtt_suffix: str):
        self.mqtt_client = mqtt_client
        self.mqtt_prefix = mqtt_prefix
        self.mqtt_suffix = mqtt_suffix

    def __send_command(self, command: str):
        self.mqtt_client.publish(
            topic=f'{self.mqtt_prefix}/command/{self.mqtt_suffix}',
            payload=command,
        )

    def on(self):
        self.__send_command('on')

    def off(self):
        self.__send_command('off')

    def toggle(self):
        self.__send_command('toggle')
