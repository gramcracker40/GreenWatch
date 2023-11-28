# Greenwatch
<p align="center">
  <img src="https://i.imgur.com/Y7tztzJ.jpg" width="250" height="250">
</p>

## Greenwatch's Purpose

To provide a way to measure and record environmental data in a greenhouse and
be able to present that data in a meaningful web application that allows for 
insightful interpretation of the data. The projects first iteration was to implement
a web application that displays four primary units of measurement: temperature, humidity, pressure
and light. As well as configuring and putting together the rasberry PIs for each individual
room in the greenhouse, building scripts to send measurement data to the backend server, etc.  
Future iterations may include controlling function within the opening of shades
or even changing the temperature of the greenhouse itself.
  
## Documentation

Within the [Docs](https://github.com/gramcracker40/GreenWatch/tree/main/docs) folder is a collection of the
Greenwatch's project documentation including various UML diagrams as well as other documents that were used for the development of the project itself.
Reference this folder for any questions you have about the purpose, architecture, or 
even the code itself. 


## Setup - Just Python with SQLite

To get the application running in a test/development environment all
you need is a machine with python 3.6 or higher and pip installed as the primary 
package manager. Also, you will want to use git to clone the repo and follow the below steps.

1. clone the repo into a directory of your choice and tunnel into the root of the project  
2. git clone https://github.com/gramcracker40/GreenWatch.git  
3. cd GreenWatch

if you would like to do it with a virtual environment build it now and activate
  pip install virtualenv
  virtualenv venv
  'source ./venv/Scripts/activate'  Windows
  'source ./venv/bin/activate'      Bash
  

4. we will now install all packages needed to run the application, run this command  
  pip install -r requirements.txt

All packages should be downloaded.   
5. Next, go to /.flaskenv and open the contents.
   Below lines detail the configuration you need in .flaskenv to run the app locally. 
   Make the changes to reflect the lines below and save the file.  
    FLASK_DEBUG=1  
    PRODUCTION=0  
    SERVER_IP="127.0.0.1:5000"  

6. Now in the root directory of the repo type the below command into a terminal  
      flask run

You now are running Greenwatch and will be brought to the login page of the
server when you go to the 127.0.0.1:5000 in your browser. 

### Note
If you are going to do the docker options, It is expected of you to have used  
docker and have it installed ready to use.   

## Setup - Docker development - PostgreSQL DB  

1. simply from the root access type the below commands  
docker-compose --file docker-compose.yml build  
docker-compose --file docker-compose.yml up  
  
2. If you would like to change any details about the database simply go to  
/.flaskenv and you would find all variables needed to configure the connection  
string to the postgresql database.   

## Setup - Docker production (Full posgresql/nginx/gunicorn deployment)  

1. go to /.flaskenv and change these values  
FLASK_DEBUG=0  
PRODUCTION=1  
SERVER_IP="Public ip of server (ex: 40.122.52.52)"    
  
2. simply from the root access type the below commands  
docker-compose --file docker-compose.prod.yml build  
docker-compose --file docker-compose.prod.yml up  
  
3. you now have three seperate containers all working in conjunction with one another  
firstly, the python flask app using gunicorn as the WSGI server on alpine linux  
secondly, the postgreSQL database you configured in /.flaskenv  
thirdly, the nginx web server running on port 80  
  
## User Interface
  
The [UserInterface](https://github.com/gramcracker40/GreenWatch/tree/main/UserInterface) folder includes all of the static html files, the javascript files that    
manipulate DOM to create dynamic html files, and the css files that style the login page. There are also javascript utility scripts that include    
functions that are   repeatedly used accross multiple files. The javascript files making the API fetch requests are also stored within the [UserInterface]    
(https://github.com/gramcracker40/GreenWatch/tree/main/UserInterface) folder.  

## Backend  
  
[Backend](https://github.com/gramcracker40/GreenWatch/tree/main/Backend) Contains the code of the [Agents]   
(https://github.com/gramcracker40/GreenWatch/tree/main/Backend/Agents), that run on the Raspberry Pi to take sensor data, and the [GreenhouseServer]  
(https://github.com/gramcracker40/GreenWatch/tree/main/Backend/GreenhouseServer) that acts as a proxy to push the agent data from the greenhouse to  
whatever remote server is running the Greenwatch application.  
  
## Hardware  
[Hardware](https://github.com/gramcracker40/GreenWatch/tree/main/Hardware) Contains information about the hardware used to take  
the measurement data and any setup processes we used to get them to where they needed to be in order to work with Greenwatch.   


## Contributors  

- [Garrett Mathers](https://github.com/gramcracker40): Project Lead & Backend  
- [Kolten Pulliam](https://github.com/klpulliam-37): Frontend & API  
- [Derrick Pollock](https://github.com/derrk): Frontend & GUI  
- [Edwin Mondragon](https://github.com/Takaximos): Hardware  
- [June Portillo](https://github.com/BastionWolf): Misc.  
