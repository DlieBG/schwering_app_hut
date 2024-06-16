from fastapi import Body, FastAPI, Request, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv, find_dotenv
from fastapi.responses import JSONResponse
from ws_mqtt_manager import WsMqttManager
from actor_manager import ActorManager
import paho.mqtt.client as mqtt
import requests, asyncio, os
from command import Command

load_dotenv(find_dotenv())

app = FastAPI()

def on_connect(client, userdata, flags, rc):
    client.subscribe('huette/+/status/#')
    client.subscribe('huette/+/events/rpc')
    client.subscribe('huette/+/steuerung')

def on_message(client, userdata, message):
    loop.create_task(
        ws_mqtt_manager.broadcast(message)
    )
    loop.create_task(
        actor_manager.event(message)
    )

@app.middleware('http')
async def check_authorization(request: Request, call_next):
    response = requests.get(
        url=os.getenv('VALIDATE_URL'),
        headers={
            'Authorization': request.headers.get('Authorization'),
        },
    )

    if response.status_code == 200:
        request.state.login = response.json()

        return await call_next(request)
    
    return JSONResponse(status_code=401, content='Unauthorized')

@app.post('/api/command')
async def send_command(command: Command = Body()):
    client.publish(
        topic=command.topic,
        payload=command.payload,
    )
    
@app.websocket('/live')
async def mqtt_live(websocket: WebSocket):
    await ws_mqtt_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
    except WebSocketDisconnect:
        ws_mqtt_manager.disconnect(websocket)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(
    os.getenv('BROKER_IP'),
    int(os.getenv('BROKER_PORT', '1883')),
)
client.loop_start()

ws_mqtt_manager = WsMqttManager(client)
actor_manager = ActorManager(client)

loop = asyncio.get_event_loop()
