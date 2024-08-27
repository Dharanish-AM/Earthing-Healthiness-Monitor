import serial
ser = serial.Serial('COM4', 9600, timeout=1)

try:
    while True:
        line = ser.readline().decode('utf-8').strip()
        if line:
            print(f'Received: {line}')
except KeyboardInterrupt:
    print('Program interrupted.')
finally:
    ser.close()
