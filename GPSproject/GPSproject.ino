#include "Adafruit_FONA.h"
#define FONA_RX 10
#define FONA_TX 9
#define FONA_RST 6
#include <SoftwareSerial.h>
SoftwareSerial fonaSS = SoftwareSerial(FONA_TX, FONA_RX);
SoftwareSerial *fonaSerial = &fonaSS;
Adafruit_FONA fona = Adafruit_FONA(FONA_RST);
String uid = "";
void setup() {
  char *letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(int i=0;i<6;i++)
    uid+=letters[random(0, 25)];
  Serial.begin(115200);
  fonaSerial->begin(4800);
  if (! fona.begin(*fonaSerial)) {
    Serial.println(F("Couldn't find FONA"));
    while (1);
  }
  Serial.println(F("FONA is OK"));
  Serial.println("Enabling GPS...");
  if (!fona.enableGPS(true))
          Serial.println(F("Failed to turn on"));
  Serial.println("GPS enabled");
  Serial.println("Enabling GPRS...");
  while(!fona.enableGPRS(true)){
          Serial.println(F("Failed to turn on"));
          delay(2500);
  }
  Serial.println("GPRS enabled"); 
}
void loop() {
        int8_t stat;
        char gpsdata[120];
        String maindata[22];
        String testStr="";
        int y = 0;
        // Find out when GPS status is good.
        do{         
          stat = fona.GPSstatus();
          if(stat < 2){
            Serial.println("Waiting for GPS");
            delay(50000);
          }
        } while(stat < 2);
          fona.getGPS(0, gpsdata, 120);
          //format of gps data: mode,fixstatus,utctime(yyyymmddHHMMSS),latitude,longitude,altitude,speed,course,fixmode,reserved1,HDOP,PDOP,VDOP,reserved2,view_satellites,used_satellites,reserved3,C/N0max,HPA,VPA
          //loop and split gps data by commas
          y=0;
          for(int x=0; y<sizeof(gpsdata);x++){
            testStr = "";
            while((gpsdata[y]!=',')&&(y<sizeof(gpsdata))){
              testStr += gpsdata[y];
              y++;
            }
            y++;
            maindata[x] = testStr;
          }
          //setup/vars for post
          char *url= "robotsyeahbaby.herokuapp.com/addWaypoint/";
          uint16_t statuscode, returncode;
          int16_t length;
          //get charout arr
          String in1="APIKEY=",in2="&waypoint=",in3=",",in4="&UID=",lat = maindata[3],lng = maindata[4],key = "yourpassword";
          String out = in1+key+in2+lat+in3+lng+in4+uid;
          char outChar[80];
          out.toCharArray(outChar, 80);
          Serial.println(outChar);
          //make sure grps is still up
          if(!fona.enableGPRS(true)){
            Serial.println(F("Failed to turn on"));
          }
          //post
            if (!fona.HTTP_POST_start(url, F("application/x-www-form-urlencoded"), (uint8_t *)(outChar), strlen(outChar), &statuscode, (uint16_t *)&length)) {
              Serial.println("Failed!");
            }
            while (length > 0) {
              while (fona.available()) {
                char c = fona.read();
                #if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)
                loop_until_bit_is_set(UCSR0A, UDRE0); /* Wait until data register empty. */
                UDR0 = c;
                #else
                Serial.write(c);
                #endif
                length--;
                if (! length) break;
              }
            }
            fona.HTTP_POST_end();
            Serial.println("End of Post");
            // Wait for 5 mins
            delay(50000);
        
        
}
