from actors.temperature_sensor import TemperatureSensor
from actors.humidity_sensor import HumiditySensor
from heating_controller import HeatingController
from actors.input_button import InputButton
from actors.input_switch import InputSwitch
from actors.switch import Switch
import paho.mqtt.client as mqtt

class ActorManager():
    def __init__(self, mqtt_client: mqtt.Client):
        self.mqtt_client = mqtt_client
    
        self.input_buttons: dict[InputButton] = {
            'top_left': self.__handler_top_left(
                InputButton(self, 'huette/schalter', 'input:0'),
            ),
            'top_right': self.__handler_top_right(
                InputButton(self, 'huette/schalter', 'input:1'),
            ),
            'bottom_left': self.__handler_bottom_left(
                InputButton(self, 'huette/schalter', 'input:2'),
            ),
            'bottom_right': self.__handler_bottom_right(
                InputButton(self, 'huette/schalter', 'input:3'),
            ),
        }

        self.input_switchs: dict[InputSwitch] = {
            'heizung_feedback': InputSwitch(self, 'huette/heizung', 'input:100'),
        }

        self.temperature = TemperatureSensor(self, 'huette/heizung', 'temperature:100')
        self.humidity = HumiditySensor(self, 'huette/heizung', 'humidity:100')

        self.switchs: dict[dict[Switch]] = {
            'deckenlampen': {
                'links': Switch(mqtt_client, 'huette/rpi', 'switch:1'),
                'rechts': Switch(mqtt_client, 'huette/rpi', 'switch:2'),
            },
            'seitenlampen': {
                'vorne_links': Switch(mqtt_client, 'huette/rpi', 'switch:3'),
                'hinten_links': Switch(mqtt_client, 'huette/rpi', 'switch:4'),
                'hinten_rechts': Switch(mqtt_client, 'huette/rpi', 'switch:5'),
                'vorne_rechts': Switch(mqtt_client, 'huette/rpi', 'switch:6'),
            },
            'außenlampen': {
                'links': Switch(mqtt_client, 'huette/rpi', 'switch:7'),
                'mitte': Switch(mqtt_client, 'huette/rpi', 'switch:8'),
                'rechts': Switch(mqtt_client, 'huette/rpi', 'switch:9'),
            },
            'weihnachtsbeleuchtung': {
                'stern_links': Switch(mqtt_client, 'huette/rpi', 'switch:12'),
                'stern_rechts': Switch(mqtt_client, 'huette/rpi', 'switch:14'),
            },
            'seitenlampen_außen': {
                'sprudelstein': Switch(mqtt_client, 'huette/rpi', 'switch:10'),
            },
            'heizung': {
                'heizung': Switch(mqtt_client, 'huette/heizung', 'switch:0'),
            },
        }

        self.heating = HeatingController(
            mqtt_client=mqtt_client,
            mqtt_topic='huette/heizung/steuerung',
            temperature_sensor=self.temperature,
            switch=self.switchs['heizung']['heizung'],
        )

    async def event(self, message):
        for key in self.input_buttons:
            await self.input_buttons[key].event(message)
        
        for key in self.input_switchs:
            await self.input_switchs[key].event(message)
            
        await self.temperature.event(message)
        await self.humidity.event(message)
        await self.heating.event(message)

    def __handler_top_left(self, input_button: InputButton) -> InputButton:
        @input_button.single_push
        def _(self):
            print("top left single push")
            self.switchs['deckenlampen']['links'].toggle()
            self.switchs['deckenlampen']['rechts'].toggle()
    
        @input_button.double_push
        def _(self):
            print("top left double push")
            self.switchs['deckenlampen']['links'].toggle()
        
        @input_button.triple_push
        def _(self):
            print("top left triple push")
            self.switchs['deckenlampen']['rechts'].toggle()
        
        @input_button.long_push
        def _(self):
            print("top left long push")
            self.switchs['deckenlampen']['links'].off()
            self.switchs['deckenlampen']['rechts'].off()
        
        return input_button

    def __handler_top_right(self, input_button: InputButton) -> InputButton:
        @input_button.single_push
        def _(self):
            print("top right single push")
            self.switchs['seitenlampen']['vorne_links'].toggle()
            self.switchs['seitenlampen']['hinten_links'].toggle()
            self.switchs['seitenlampen']['hinten_rechts'].toggle()
            self.switchs['seitenlampen']['vorne_rechts'].toggle()
    
        @input_button.double_push
        def _(self):
            print("top right double push")
            self.switchs['seitenlampen']['vorne_links'].toggle()
            self.switchs['seitenlampen']['vorne_rechts'].toggle()
        
        @input_button.triple_push
        def _(self):
            print("top right triple push")
            self.switchs['seitenlampen']['vorne_links'].toggle()
            self.switchs['seitenlampen']['hinten_rechts'].toggle()
        
        @input_button.long_push
        def _(self):
            print("top right long push")
            self.switchs['seitenlampen']['vorne_links'].off()
            self.switchs['seitenlampen']['hinten_links'].off()
            self.switchs['seitenlampen']['hinten_rechts'].off()
            self.switchs['seitenlampen']['vorne_rechts'].off()
        
        return input_button

    def __handler_bottom_left(self, input_button: InputButton) -> InputButton:
        @input_button.single_push
        def _(self):
            print("bottom left single push")
            self.switchs['außenlampen']['links'].toggle()
            self.switchs['außenlampen']['mitte'].toggle()
            self.switchs['außenlampen']['rechts'].toggle()
    
        @input_button.double_push
        def _(self):
            print("bottom left double push")
            self.switchs['außenlampen']['mitte'].toggle()
        
        @input_button.triple_push
        def _(self):
            print("bottom left triple push")
            self.switchs['seitenlampen_außen']['sprudelstein'].toggle()
        
        @input_button.long_push
        def _(self):
            print("bottom left long push")
            self.switchs['außenlampen']['links'].off()
            self.switchs['außenlampen']['mitte'].off()
            self.switchs['außenlampen']['rechts'].off()
            self.switchs['seitenlampen_außen']['sprudelstein'].off()
        
        return input_button

    def __handler_bottom_right(self, input_button: InputButton) -> InputButton:
        @input_button.single_push
        def _(self):
            print("bottom right single push")
            self.switchs['weihnachtsbeleuchtung']['stern_links'].toggle()
            self.switchs['weihnachtsbeleuchtung']['stern_rechts'].toggle()
    
        @input_button.double_push
        def _(self):
            print("bottom right double push")
            self.switchs['weihnachtsbeleuchtung']['stern_links'].toggle()
        
        @input_button.triple_push
        def _(self):
            print("bottom right triple push")
            self.switchs['weihnachtsbeleuchtung']['stern_rechts'].toggle()
        
        @input_button.long_push
        def _(self):
            print("bottom right long push")
            for group_key in self.switchs:
                for switch_key in self.switchs[group_key]:
                    self.switchs[group_key][switch_key].off()
        
        return input_button
