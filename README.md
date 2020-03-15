# Bowling scoring API (Node.js)

## Introduction

The goal of this API is to serve the following purposes:
* to start a new game with either 1 or 2 players
* to input a user's results frame by frame
* to retrieve my current score
* to retrieve frame by frame history
* to specify a historic game and retrieve the results
* to see an end to end test that simulates a real game

The solution should be deployed to a live environment for testing.

## Structure

*(please also see the ```classdiagram.puml``` too)*

### API endpoints

```app.js``` is responsible for routing all requests. The following endpoints are defined:
* ```/init``` (POST) - Initialises a game with N players
* ```/availableGames``` (GET) - Retrieves how many games were initiated (should be indexed from 0)
* ```/roll``` (POST) - Performs a roll in a specific game for a specific user
* ```/rollingScore``` (GET) - Retrieves rolling score in a specified game for a specified player
* ```/frame``` (GET) - Retrieves a specified frame in a specified game for a specified player
* ```/calculateScore``` (GET) - Calculates score for a given array of (historic) rolls.

For more detailed specification, please refer to the file itself.

### class Game

This class is responsible for holding players playing one game together.

### class Player

All magic happens here. The core essence is the the ```get rollingScore()```. It might seem as [this Python solution](https://www.reddit.com/r/dailyprogrammer/comments/3ntsni/20151007_challenge_235_intermediate_scoring_a/cvrc1g9/). The only "inspiration" that knocked me while being stuck was the following line: ```if len(line) - 3 <= x:```.

## How to run

It is standard npm application. Therefore the basic scripts are needed to get the app up and running:
```
npm install
npm start
```

After that the API will be available at http://localhost:3000. The demo live app can be found here: https://ilia-filin-bowling.herokuapp.com/. You can use the ```bowling.postman_collection.json``` in Postman for easier testing.

### Testing

```npm install``` will install ```mocha``` and ```chai``` npm packages. They are used for testing the application on unit (```class Player```) and integration (API endpoints) levels. To run the tests, use the following command:
```
npm test
```
