#include <SPI.h>
#include <LoRa.h>

void setup() {
  Serial.begin(9600);
  while (!Serial);

  // Initialize LoRa on frequency 866 MHz (correct for India)
  if (!LoRa.begin(866)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
}

void loop() {
  // Try to parse a packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // Received a packet
    String packetData = "";

    // Read the packet
    while (LoRa.available()) {
      packetData += (char)LoRa.read();
    }

    // Print only the packet data
    Serial.println(packetData);
  }
}
