import serial
import requests
ser = serial.Serial('COM5', 9600, timeout=1)
url = 'http://localhost:8000/loradata'

try:
    while True:
        line = ser.readline().decode('utf-8').strip()
        if line:
            print(f'Data: {line}')
            response = requests.post(url, json={'data': line})
            print(f'Status Code: {response.status_code}')
            print(f'Response: {response.text}')
finally:
    ser.close()
