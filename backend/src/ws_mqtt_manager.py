from fastapi import WebSocket

class WsMqttManager():
    def __init__(self, mqtt_client):
        self.mqtt_client = mqtt_client

        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message):
        for connection in self.active_connections:
            await connection.send_json({
                'topic': message.topic,
                'payload': message.payload.decode('utf-8'),
            })
