const int sensorPin = A0;        // Analog input pin for ACS712 sensor
const float Vcc = 5.0;           // Supply voltage to the Arduino
const float sensitivity = 0.185; // Sensitivity of the ACS712 in V/A (for 5A version)
const int numReadings = 100;     // Number of readings to average

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  float current = getCurrentAC();
  Serial.print("AC Current (A): ");
  Serial.println(current);
  delay(15000); // Delay between readings
}

float getCurrentAC()
{
  long sum = 0;

  // Take multiple readings and average them
  for (int i = 0; i < numReadings; i++)
  {
    sum += analogRead(sensorPin);
  }

  float averageReading = sum / (float)numReadings;

  // Convert the analog reading to voltage
  float voltage = (averageReading / 1024.0) * Vcc;

  // Convert voltage to current
  // For ACS712, the output is centered around Vcc/2 (2.5V for a 5V system)
  float current = ((Vcc / 2) - voltage) / sensitivity;

  return current;
}
