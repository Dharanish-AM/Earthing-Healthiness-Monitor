#include <SPI.h>
#include <LoRa.h>

void setup() {
  Serial.begin(9600);           
  while (!Serial);

  if (!LoRa.begin(866)) {    
    Serial.println("Starting LoRa failed!");
    while (1);
  }
}

void loop() {
  Serial.println("Data Sent");

  LoRa.beginPacket();           
  LoRa.print("{\"id\": \"000001\", \"ct\": \"25\"}");   
  LoRa.endPacket();            

  delay(5000);                  
}
