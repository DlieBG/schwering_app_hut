from fastapi import Body, FastAPI, Request, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv, find_dotenv
from fastapi.responses import JSONResponse
from manager import ConnectionManager
import paho.mqtt.client as mqtt
import requests, asyncio, os
from command import Command

load_dotenv(find_dotenv())

app = FastAPI()

def on_connect(client, userdata, flags, rc):
    client.subscribe('huette/+/status/#')

def on_message(client, userdata, message):
    loop.create_task(
        manager.broadcast(message)
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

@app.post('/command')
async def send_command(command: Command = Body()):
    client.publish(
        topic=command.topic,
        payload=command.payload,
    )
    
@app.websocket('/live')
async def mqtt_live(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(
    os.getenv('BROKER_IP'),
    int(os.getenv('BROKER_PORT', '1883')),
)
client.loop_start()

manager = ConnectionManager(client)

loop = asyncio.get_event_loop()
