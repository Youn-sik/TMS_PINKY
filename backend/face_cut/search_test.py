import paho.mqtt.client as mqtt

client = mqtt.Client()
# client.on_connect = on_connect
# client.on_disconnect = on_disconnect
# client.on_publish = on_publish
# client.on_message = on_message
client.connect('localhost', 1883)
client.subscribe("/access/realtime/+")
client.subscribe("/user/add/+")
client.loop_forever()