hardware about page - edwin to finish

## Setting up Raspberry PI (URLs can be used as aide)

    First and foremost, an operating system needs to be implemented into the raspberry pi. In order to do so there are a couple of steps:

    ```
        1. Have an micro SD card that has been formated.
            !(https://www.lifewire.com/format-sd-card-using-windows-4128719#:~:text=How%20to%20Format%20SD%20Card%20on%20Windows%201,entering%20it%20into%20the%20Volume%20label.%20See%20More, there are seperate hardware that that will give the option once plugged into a computer with the micro SD card)
        2. Once that is done get the Raspberry Pi OS using Raspberry Pi Imager .
            !(https://www.raspberrypi.com/software/ [there's also a quick video for help in the site])
        3. Next the Raspberry Pi Imager will open, specify what OS is wanted and direct the OS so that it will burn onto the micro SD card.
        4. Once the process is done eject the micro SD card.
        5. Put the micro SD card onto the raspberry pi.
        6. For the next steps an HDMI chord, a power cable (micro-usb cable), a keyboard, mouse, and a monitor (or TV) will be needed in order to access the OS in the raspberry pi.
        7. Connect all of the components in step 6 onto the raspberry pi,  the HDMI chord to the monitor, and connect the power cable to an available outlet.
        8. Once all that is done from the monitor a set up process will be available.
        9. Follow the procedures and change any desired settings.
        10. Now the the raspberry pi has OS fully integrated.
    ```

## How to set up Sensors

    There are many ways to connect sensors to the raspberry pi whether it may be directly like the Sense HAT (can also be connected via solderless jumper cables), or via the solderless jumper cables (https://core-electronics.com.au/guides/piicodev-atmospheric-sensor-bme280-raspberry-pi-guide/ is a great example for atmospheric readings). Now how limiting are the connections to the raspberry pi? When it comes to the maximum number of connections going into raspberry pis, it is quite limiting (raspberry pi 2b only having 40 pins). There is a product in the market that extends these capabilities, that being the breadboard(https://th.bing.com/th/id/OIP.nP69FSBeNj6EE7vzYtXVwgHaHa?pid=ImgDet&rs=1). Now the breadboard can be thought of a power strips surge protector for raspberry pi boards, this will allow multiple connections to be more accessable, and making things a bit more cleaner. How the breadboards data/power flow works, it is mostly row-wise, the only exception being the power and ground connection being column-wise connection (https://i.stack.imgur.com/bpttx.png). While it may seem like alot, the use of each pins needs to be taken into consideration, since each one serves their own purpose. For instance a simple red diode connection to a raspberry pi 4 using a breadboard and a resistor: 
    !(https://www.learnrobotics.org/wp-content/uploads/2019/01/LED-Wiring-Raspberry-Pi-LED-300x203.png)
    (This serves as an example to visualize how connections work)
    ```
        1.  First connect the raspberry pi board to power.
        2.  From there connect the ground (6th inner pin out opposite side from the ethernet cable) to its designated area (the negative blue column).
        3.  Next connect the STRAIGHT pin (there are 2 types one straight and one bent at an angle) of the diode either directly to the ground column or via solderless jumper cable.
        4.  Following that connect the bent pin from the diode to any of the row-wise connections from the breadboard.
        5. Then to a socket adjacent to the connected angled pin connect one end to the resistor and have the other end connect at a reachable socket next to the angled pin (NOT THE SAME ROW).
        6. Next connect the GPIO 17 pin out from the raspberry pi board (7th pin out following the ground pin out) to the end of the resistor that leads to the diode.
        7. From there you can run simples codes to see if the connection works or not under the programming in the raspberry OS
    ```
    There are multiple diagrams that show connections to sensors on the internet, the following shows the diagram for the connections of the photoresistor which are used in the Greenhouse Project. 
    !(https://tutorials-raspberrypi.de/wp-content/uploads/Raspberry-Pi-Helligkeitssensor-Fototransistor-Steckplatine-600x477.png).
    

## Hardware Infrastructure

    All of the Raspberry Pi's are designed almost differently, the only difference being some come with features others do not. A great example is the Rasoberry Pi 4 which has wi-fi capabilities, while the raspberry pi 2 does not. It is once one goes into the pin out lay out where most of the raspberry pi are near identitical. The following is an image of the pin layout of a Raspberry Pi 4:
    !(https://www.etechnophiles.com/wp-content/uploads/2021/01/R-Pi-4-GPIO-Pinout-1.jpg)

    Some of the pins are self-explanatory, one being the 3.3V and 5V which provides power to certain sensors, or like the ground which acts like the ground option for the sensors. It is once the individuals look at the GPIO pins that makes the head scratch. First GPIO stands fir "General Purpose Input/Output", knowing that now most of the pins become sself-explanatory, but still hold their own purpose. Following that most of the other components provided are easier to understand, USB-Ports are for any other external connections all be it mouse, keyboard, etc. The HDMI chord will allow the user to connect the pi board to any monitor with HDMI port alongside it to see the what the raspberry pi board has going on internally. A micro-USB port to provide power to the board. Micro-SD port to provide extended services to the board (ie the Operating Systen).

4. rasberry pi cases and the design used to build them for rasberry pi. 
