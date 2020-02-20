# FEND Capstone - Travel APP

### by Mindaugas Pazereckas

## Introduction

This is the final project of Udacity Front end Nanodegree program. It is a single page application. After submitting city's name, trip's start date and trip's end date application is calling three different APIs:
- Geonames - to receive coordinatios of the city
- DarkSky - to receice temperature data
- Pixabay - to reiceive picture which is realted to the city

## Project Dependencies

The ‘cors’ package should be installed in the project from the command line, required in the project file server.js, and the instance of the app should be setup to use cors().+

The body-parser package should be installed and included in the project.

## Local Server

Local server should be running and producing feedback to the Command Line through a working callback function.

## Service workers

This project has implemented service workers

# Getting started

## Setup Project

- Download the project .zip file to you computer and unzip the file or clone this repository to your desktop.
- In terminal please run command `npm run build-prod` and after successful build please run command `npm start`

## Additional feature in this project

Added feature to count and display trip duration on UI. User needs to enter start and end date of the trip and application will count how long his trip will be.