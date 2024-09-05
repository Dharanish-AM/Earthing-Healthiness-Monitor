import serial
import requests
import winsound 

BEEP_FREQUENCY = 1000
BEEP_DURATION = 500  

ser = serial.Serial("COM4", 9600, timeout=1)
url = "http://localhost:8000/loradata"

try:
    while True:
        try:
            line = ser.readline().decode("utf-8").strip()

            if line:
                print(f"Received: {line}")
                try:
                    details = line.split(",")
                    data_id = details[0]
                    ct = float(details[1])

                    response = requests.post(
                        url, json={"data": {"id": data_id, "ct": ct}}
                    )
                    print(
                        f"Data sent: {details} with response code: {response.status_code}"
                    )

                   
                    if ct > 1:
                        winsound.Beep(BEEP_FREQUENCY, BEEP_DURATION)  
                except Exception as e:
                    print(f"Error in processing or sending data: {e}")

        except Exception as e:
            print(f"Error reading or decoding data: {e}")

finally:
    ser.close()
