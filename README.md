## A Live Performance Assistance for Laptop Orchestras

Created for my thesis at the Australian National University.

## Instructions for Use

1. Clone the repo
2. In the base directory, run `npm install` or `yarn install`
3. Open two terminal windows both at the base directory
4. First window
    1. run `node src/server/server.js`
5. Second window
    1. run `npm start` or `yarn start`

From here you should have both a performer client running and the server listening on port 8000. 

#### If you are running this on an individual computer:

Duplicate the client tab in your web browser and select a host by clicking the 'pick me as host' button in the top right of screen. Duplicate more performer client tabs to simulate additional performers in the ensemble.

#### If you are running this over a local area network:

The create-react-app CLI will provide you with the IP address the app is being served on. From `localhost:3000`, select the 'pick me as host button' in the top right of the performer client screen. After loading the host page, get all ensemble members to load the IP address in their web browser (tested on Chrome and Firefox). 

You will be able to see each performer client connect with the initialisation status of their local Magenta.js RNN models. Once all models are loaded, press the 'send chords' button and wait for all performers' clients to report the successful generation of the first note sequences. Once all clients are green (good to go), press the 'start' button to begin playing the piece.

Note: the connection, initialisation and first round of generation procedure might require a few rounds of refreshing all clients if performed over a network. The app is stable however connections can be prone to drop for various reasons (to be fixed).

___

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
