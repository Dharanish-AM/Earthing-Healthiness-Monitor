import serial
import requests

ser = serial.Serial("COM7", 9600, timeout=1)
url = "http://localhost:8000/loradata"

try:
    while True:
        try:
            line = ser.readline().decode("utf-8").strip()

            if line:
                print(f"Received: {line}")
                try:
                    details = line.split(",")
                    response = requests.post(url, json={"data": {"id" : details[0] , "ct" : details[1]}})
                    print(
                        f"Data sent: {details} with response code: {response.status_code}"
                    )
                except Exception as e:
                    print(f"Error in processing or sending data: {e}")

        except Exception as e:
            print(f"Error reading or decoding data: {e}")

finally:
    ser.close()
