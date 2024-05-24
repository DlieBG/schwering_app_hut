#!/usr/bin/env python
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

pins = {
    "huette/1": 15,
    "huette/2": 18,
    "huette/3": 23,
    "huette/4": 24,
    "huette/5": 25,
    "huette/6": 8,
    "huette/7": 7,
    "huette/8": 12,
    "huette/9": 16,
    "huette/10": 20,
    "huette/11": 21,
    "huette/12": 26,
    "huette/13": 11,
    "huette/14": 13,
    "huette/15": 6,
    "huette/16": 5,
}

def setup_GPIO():
    GPIO.setmode(GPIO.BCM)
    for pin in pins:
        GPIO.setup(pins[pin], GPIO.OUT)

def on_connect(client, userdata, flags, rc):
    client.subscribe("#")

def on_message(client, userdata, msg):
    try:
        if pins[msg.topic]:
            if msg.payload == b'1':
                GPIO.output(pins[msg.topic], GPIO.LOW)
            else:
                GPIO.output(pins[msg.topic], GPIO.HIGH)     
    except:
        pass

setup_GPIO()

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("10.16.1.11", 1883, 60)

client.loop_forever()
