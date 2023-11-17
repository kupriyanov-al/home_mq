import RPi.GPIO as GPIO                 # Импортируем библиотеку по работе с GPIO
import Adafruit_DHT
import json
import random
import time, datetime
from paho.mqtt import client as mqtt_client

# настройка соединения mqtt
broker = 'test.mosquitto.org'
port = 1883
topic = "rasp"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 100)}'

def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def publish(client, msg):
        msg = json.dumps(msg)
        result = client.publish(topic, msg)
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
       
client = connect_mqtt()


try:
    # === Инициализация пинов ===
    pin=11
    DHT_PIN = 4
    COOL_PIN = 8
    relePin = 22
    
    DHT_SENSOR = Adafruit_DHT.DHT22
    GPIO.setmode(GPIO.BOARD)                
    GPIO.setup(pin, GPIO.OUT, initial=0)
    GPIO.setup(COOL_PIN, GPIO.OUT, initial=0)
    GPIO.setup(relePin, GPIO.OUT, initial=0)
    
    # температура включения вентилятора 
    temp_on = 25 
    # изменение температуры для отключения вентилятора
    temp_delta = 1
    # состояние вентилятора
    CoolState = False 
    # состояние реле
    ReleState = False
    # время включения реле
    time_on_rele = "21:44"
    # период работы реле в сек
    period_rele_on = 50
    
    
    def get_temp_hum():
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
        if humidity is not None and temperature is not None:
            temperature = round(temperature,1)
            humidity = round(humidity,1)
            DHT={'humidity':humidity,'temperature':temperature}        
        return DHT
        
    # Здесь размещаем основной рабочий код
    while True:
        DHT=get_temp_hum()
        print("Temp={0}*C Humidity={1}%".format(DHT['temperature'], DHT['humidity']))
        if DHT['temperature']>temp_on and not CoolState or DHT['temperature']<temp_on-temp_delta and CoolState:
            CoolState=not CoolState
            GPIO.output(COOL_PIN, CoolState)
            
            print(CoolState)
        
        time_obj = time.strptime(time_on_rele, "%H:%M") # преобразование времени в объект 

        now = datetime.datetime.now()
        todayon = now.replace(hour = time_obj.tm_hour, minute=time_obj.tm_min, second =0, microsecond =0)
        seconds = (now  - todayon).total_seconds()
        if now >= todayon and seconds < period_rele_on and not ReleState or now > todayon and seconds > period_rele_on and ReleState:
            ReleState = not ReleState
            GPIO.output(relePin, ReleState)
            print(ReleState)
            
        msg = {"datastamp": now.strftime(
            '%d.%m.%Y %H:%M:%S'),  "temperatura": DHT['temperature'], "humidity": DHT['humidity'], "CoolState": CoolState, "ReleState": ReleState}

        publish(client,msg)    
        #else:
        #    GPIO.output(relePin, False)
        print(seconds)    
        time.sleep(2)
        
except KeyboardInterrupt:
    # ...
    print("Exit pressed Ctrl+C")        # Выход из программы по нажатию Ctrl+C
except:
    # ...
    print("Other Exception")            # Прочие исключения
finally:
    GPIO.cleanup()                      # Возвращаем пины в исходное состояние
    print("End of program")             # Информируем о завершении работы программы


