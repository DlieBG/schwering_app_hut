import json

class InputSwitch():
    def __init__(self, parent, mqtt_prefix: str, mqtt_suffix: str):
        self.parent = parent
        self.mqtt_prefix = mqtt_prefix
        self.mqtt_suffix = mqtt_suffix
    
        self.__toggles = []
        self.state = False
    
    async def event(self, message):
        if message.topic == f'{self.mqtt_prefix}/status/{self.mqtt_suffix}':
            self.state = json.loads(message.payload).get('state', False)
            self.__invoke(self.__toggles)

    def __invoke(self, funcs):
        for func in funcs:
            func(self.parent, self.state)

    def toggle(self, func):
        self.__toggles.append(func)
