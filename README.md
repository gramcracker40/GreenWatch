# Greenwatch

# UPDATE BEFORE TURNING IN
<p align="center">
  <img src="https://i.imgur.com/Y7tztzJ.jpg" width="250" height="250">
</p>

<p align="center"> 

</p>

## Greenwatch's Purpose

The purpose of this student project is to provide a means of monitoring and recording enviromental conditions of the Midwestern State University Greenhouse. In addition to keeping records of humidity and temperture, this project aims to send alerts/updates to users of the service. This repository is the software aspect of the of the Greenwatch project that will run on hardware portion which consists, at time of writing, 4 Raspberry pis with 3 of them attached to 3 pi sense hats to take measurements of the 3 rooms currently in operation of the greenhouse with the final Raspberry pi acting as the server.
  
## Documentation

Within the [Docs](https://github.com/gramcracker40/GreenWatch/tree/main/docs) folder is a collection of the Greenwatch's project documentation including various UML diagrams as well as other documents that were used for the development of the project itself.

## User Interface

The [UserInterface](https://github.com/gramcracker40/GreenWatch/tree/main/UserInterface) folder includes all of the static html files, the javascript files that manipulate DOM to create dynamic html files, and the css files that style the login page. There are also javascript utility scripts that include functions that are repeatedly used accross multiple files. The javascript files making the API fetch requests are also stored within the [UserInterface](https://github.com/gramcracker40/GreenWatch/tree/main/UserInterface) folder.

## Backend

[Backend](https://github.com/gramcracker40/GreenWatch/tree/main/Backend) Contains the code of the [Agents](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agents), that run on the 3 intended Raspberry Pi to take sensor data, and the [Server](https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Server) that stores the data.

## Contributors

- [Garrett Mathers](https://github.com/gramcracker40): Project Lead & Backend
- [Kolten Pulliam](https://github.com/klpulliam-37): API & Frontend
- [Derrick Pollock](https://github.com/derrk): Frontend
- [Edwin Mondragon](https://github.com/Takaximos): Hardware
- [June Portillo](https://github.com/BastionWolf): Misc.
