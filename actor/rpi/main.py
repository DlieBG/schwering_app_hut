import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import json, time, sys

broker = {
    "ip": "10.16.1.11",
    "port": 1883,
}

pins = {
    "huette/rpi/command/switch:1": 15,
    "huette/rpi/command/switch:2": 18,
    "huette/rpi/command/switch:3": 23,
    "huette/rpi/command/switch:4": 24,
    "huette/rpi/command/switch:5": 25,
    "huette/rpi/command/switch:6": 8,
    "huette/rpi/command/switch:7": 7,
    "huette/rpi/command/switch:8": 12,
    "huette/rpi/command/switch:9": 16,
    "huette/rpi/command/switch:10": 20,
    "huette/rpi/command/switch:11": 21,
    "huette/rpi/command/switch:12": 26,
    "huette/rpi/command/switch:13": 11,
    "huette/rpi/command/switch:14": 13,
    "huette/rpi/command/switch:15": 6,
    "huette/rpi/command/switch:16": 5,
}

def setup_GPIO():
    GPIO.setmode(GPIO.BCM)
    for pin in pins:
        GPIO.setup(pins[pin], GPIO.OUT)
        GPIO.output(pins[pin], GPIO.HIGH)     

def on_connect(client, userdata, flags, rc):
    client.subscribe("huette/rpi/#")

def on_message(client, userdata, msg):
    try:
        if pins[msg.topic]:
            payload = msg.payload.decode("utf-8")

            if payload == "on":
                GPIO.output(pins[msg.topic], GPIO.LOW)
            elif payload == "off":
                GPIO.output(pins[msg.topic], GPIO.HIGH)     
            elif payload == "toggle":
                GPIO.output(pins[msg.topic], not GPIO.input(pins[msg.topic]))     

            client.publish(
                msg.topic.replace("command", "status"),
                json.dumps({
                    "output": not GPIO.input(pins[msg.topic]),
                })
            )
    except:
        pass

while True:
    try:
        setup_GPIO()

        client = mqtt.Client("huette-rpi")
        client.on_connect = on_connect
        client.on_message = on_message

        client.connect(broker["ip"], broker["port"], 60)

        print('rpi actor started')
        client.loop_forever()
    except KeyboardInterrupt:
        sys.exit(0)
    except:
        print('retry in 10 seconds')
        time.sleep(10)
    finally:
        GPIO.cleanup()
