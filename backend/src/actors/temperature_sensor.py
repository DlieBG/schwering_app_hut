import json

class TemperatureSensor():
    def __init__(self, parent, mqtt_prefix: str, mqtt_suffix: str):
        self.parent = parent
        self.mqtt_prefix = mqtt_prefix
        self.mqtt_suffix = mqtt_suffix

        self.__updates = []
        self.temperature = None
    
    async def event(self, message):
        if message.topic == f'{self.mqtt_prefix}/status/{self.mqtt_suffix}':
            self.temperature = json.loads(message.payload).get('tC')
            self.__invoke(self.__updates)
    
    def __invoke(self, funcs):
        for func in funcs:
            func(self.parent, self.temperature)
    
    def update(self, func):
        self.__updates.append(func)
