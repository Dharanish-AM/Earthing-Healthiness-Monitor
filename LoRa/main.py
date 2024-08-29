import serial
import requests

ser = serial.Serial("COM4", 9600, timeout=1)
url = "http://localhost:8000/loradata"

try:
    while True:
        try:
            line = ser.readline().decode("utf-8").strip()

            if line:
                print(f"Received: {line}")
                try:
                    data = eval(line)
                    response = requests.post(url, json={"data": data})
                    print(
                        f"Data sent: {data} with response code: {response.status_code}"
                    )
                except Exception as e:
                    print(f"Error in processing or sending data: {e}")

        except Exception as e:
            print(f"Error reading or decoding data: {e}")

finally:
    ser.close()
