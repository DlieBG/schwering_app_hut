import json

class InputButton():
    def __init__(self, parent, mqtt_prefix: str, component: str):
        self.parent = parent
        self.mqtt_prefix = mqtt_prefix
        self.component = component
    
        self.single_pushs = []
        self.double_pushs = []
        self.triple_pushs = []
        self.long_pushs = []

    async def event(self, message):
        if message.topic == f'{self.mqtt_prefix}/events/rpc':
            payload = json.loads(message.payload)
            
            for event in payload['params']['events']:
                if event['component'] == self.component:
                    match event['event']:
                        case 'single_push':
                            self.__invoke(self.single_pushs)
                        case 'double_push':
                            self.__invoke(self.double_pushs)
                        case 'triple_push':
                            self.__invoke(self.triple_pushs)
                        case 'long_push':
                            self.__invoke(self.long_pushs)

    def __invoke(self, funcs):
        for func in funcs:
            func(self.parent)

    def single_push(self, func):
        self.single_pushs.append(func)

    def double_push(self, func):
        self.double_pushs.append(func)

    def triple_push(self, func):
        self.triple_pushs.append(func)

    def long_push(self, func):
        self.long_pushs.append(func)
