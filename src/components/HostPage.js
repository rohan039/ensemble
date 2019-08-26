import React from 'react';

import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { MusicRNN } from '@magenta/music';
import { presetMelodies } from '../utils/clips';

import * as api from '../api';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import PianoLayout from './PianoLayout';
import InfoDisplay from './InfoDisplay';

const chordProgressions = [
  [
    'C', 'Am', 'F', 'G',
    'C', 'F', 'G', 'C',
  ],
  [
    'C', 'Am', 'F', 'G',
    'C', 'F', 'G', 'C',
    // 'C', 'Am', 'F', 'G',
    // 'C', 'F', 'G', 'C',
  ],
  [
    'C', 'Am', 'F', 'G',
    'C', 'F', 'G', 'C',
    'C', 'Am', 'F', 'G',
    'C', 'F', 'G', 'C',
  ],
];

export class HostPage extends React.Component {

  constructor(props) {
    super(props);

    this.keyboard = new AudioKeys({
      polyphony: 8,
      rows: 1,
      priority: "last"
    });

    this.state = {
      isHost: false,
      startError: false,
      readyModelClients: [],
      readyNotesClients: [],
      connections: [],
      showChords: false
    }

    this.nOfBars = 8;


    api.openConnection();

    api.subscribeToHostUpdates((event, hostID) => {
      if (event === 'hostDisconnected') {
        console.log('The host disconnected');
      } else if (event === 'hostExists') {
        console.log('A host is connected');
      }
    })

    // Try to be the host
    api.connectHost();

    // Check if you were successful
    api.hostSuccess((yesNo, hostID) => {

      if (yesNo) {
        this.setState({ isHost: true, hostID })
      } else {
        this.setState({ isHost: false })
      }
    })

    api.clientUpdates(connections => {
      this.setState({ clients: connections })
      console.log(connections);
    })

    api.getClientsModelReady(clients => {
      this.setState({ readyModelClients: clients })
    })

    api.getClientsNotesReady(clients => {  
      this.setState({ readyNotesClients: clients })
    })

    api.pingClientModelStatus()
    api.pingClientNotesStatus()

    // this.initChordRNN(chordProgressions[2]);
  }


  // initChordRNN(chordProgression) {

  //   const model = new MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
  //   model.initialize()
  //     .then(() => {
  //       console.log('chord model initialized!');
  //       return model.continueSequence(
  //         presetMelodies['Twinkle'],
  //         this.nOfBars * 16,
  //         1.0, // Temp
  //         chordProgression,
  //         );
  //     })
  //     .then((i) => {
  //       // console.log(i);
  //       this.setMelodies([i], chordProgression);
  //       this.model = model;
  //       this.setState({
  //         loadingModel: false,
  //       });
  //       // this.sound.triggerSoundEffect(4);
  //       console.log('chord model loaded');
  //     });
  // }

  componentWillUnmount = () => {

    api.disconnectMe()
    console.log('should disconnect');

  }

  disc = () => {
    api.disconnectMe()
  }

  setMelodies = (i, chordProgression) => {

  }

  // playNote = (value) => {
  //   if (value[0] === 144 && value[2] != 0) {
  //     piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), true);
  //   } else if (value[0] === 144 || value[0] === 128) {
  //     piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), false);
  //   }
  // }

  sendChords = () => {

    if (this.state.readyModelClients.length > 2) {
      api.sendChords(chordProgressions[2])
      this.setState({ startError: false, showChords: true })
    } else {
      this.setState({ startError: true })
    }

  }

  start = () => {
    api.tellStart();
  }

  render() {
    return (
      <div className="App">
        <h1>Conductor</h1>
        <Container fluid={true}>
          <Row noGutters={true}>
            <Col>
              {this.state.isHost &&
                <div>
                  <h2>
                    You are the host
              </h2>
                  {this.state.clients && <p>{this.state.clients.length - 1} clients connected.</p>}

                  
                  <InfoDisplay />
                  {this.state.showChords && <p>Sending 16 bars of chords: <br/> C, Am, F, G, C, F, G, C,
                  C, Am, F, G, C, F, G, C, </p>}

                  {this.state.readyModelClients.length > 2 && <Button onClick={this.sendChords}>Send Chords</Button>}
                  {this.state.readyNotesClients.length > 2 && <Button variant="success" onClick={this.start}>Start</Button>}
                  
                  {this.state.startError && <p> Either all clients are not ready or less than 3 are connected and ready</p>}
                </div>

              }

              {!this.state.isHost &&
                <div>
                  <h2>
                    A host is already connected
                </h2>
                  <Button onClick={this.disc} as={NavLink} to="/base">Go Back</Button>
                </div>
              }
            </Col>
            <Col>
              <h3>Connected Clients</h3>
              <ListGroup variant="flush">
                {this.state.clients && this.state.clients.map((client) => {
                  if (client !== this.state.hostID) {
                    if (this.state.readyNotesClients && this.state.readyNotesClients.includes(client)) {
                      return <ListGroup.Item key={client} variant="success">{client}'s notes are ready!</ListGroup.Item>
                    } else if (this.state.readyModelClients && this.state.readyModelClients.includes(client)) {
                      return <ListGroup.Item key={client} variant="warning">{client}'s model is loaded!</ListGroup.Item>
                    } else {
                      return <ListGroup.Item key={client}>{client}</ListGroup.Item>
                    }
                    
                  }
                })}
                {(!this.state.clients || this.state.clients.length === 1) &&
                  <ListGroup.Item>No clients connected</ListGroup.Item>}
              </ListGroup>
            </Col>
          </Row>
        </Container>





      </div>
    )
  }
}

export default HostPage;
