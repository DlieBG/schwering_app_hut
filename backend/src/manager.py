from fastapi import WebSocket

class ConnectionManager():

    def __init__(self, mqtt_client):
        self.active_connections: list[WebSocket] = []
        self.mqtt_client = mqtt_client

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
