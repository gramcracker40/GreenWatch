# Greenwatch- Documents

## Swim Lane

The [Swim Lane Diagram](https://github.com/gramcracker40/GreenWatch/blob/main/docs/Green%20Watch%20-%20Swim%20Lane.png) details the line of decisions that can be done by the User, Interface, and API
![Green Watch - Swim Lane](https://user-images.githubusercontent.com/70359688/227833289-7ddb3fd5-0ac0-49f7-b754-a738b6745346.png)


## Use Case Diagram

The [Use Case Diagram](https://github.com/gramcracker40/GreenWatch/blob/main/docs/Greenwatch%20Detailed%20Use%20case%20Diagram_.jpg) details how each actor (User, Admin, and [Rooms Agent](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agent)) are able to use and interact with different parts of the system. 
- The User can observe data (which fetches info from the Sensor data), Login/Logout of the service, and manage their notes. 
- The Admin is able to do the same as the User as well as the ability to manage all notes, manage users, manage alerts, manage room experiments, Manage rooms, and manage the rooms [Agents](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agent). 
- The [Rooms Agent](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agents) (that resides on the Rasberry Pis with sensors) monitor and collects the data of their respective rooms.
![Greenwatch Detailed Use case Diagram_ (1)](https://user-images.githubusercontent.com/70359688/227832959-60e6180e-4df1-4721-a368-3112c484d261.jpg)


## UML Diagram

The [UML Diagram](https://github.com/gramcracker40/GreenWatch/blob/main/docs/UML%20Diagram.pdf) shows the interactions in between the different aspects of the greenhouse and actors and their attributes as they exist as classes within the system.
- Greenhouse is associated with Users and Rooms. The Greenhouse is composed of a [server](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Server).
- Room is associated with the Greenhouse and the measurements. A Room is composed of Alerts and of an [Agent](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agent).
- [server](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Server) cannot exist without a Greenhouse. It is also strongly associated with the [Agents](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agent).
- [Agents](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agent) cannot exist without a Room and is strongly associated with the measurements
- Alerts cannot exist without belonging to a Room.
- Measurements are associated with the room they come from
- Users are associated with the Greenhouse
![Greenhouse Class Diagram](https://user-images.githubusercontent.com/70359688/227832894-13714ae7-b5cb-4ae0-b76e-8716776d552e.png)

## Quick Start Guide

The [Quick Start Guide](https://github.com/gramcracker40/GreenWatch/blob/main/docs/quick-start-guide-v1.1-rasberry-pi.pdf) is simply the quick start guide for the rasberry pi.

