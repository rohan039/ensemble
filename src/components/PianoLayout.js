import React from 'react';
import { connect } from 'react-redux';
import { Piano } from 'react-nexusui';
// import { googleLogin } from '../actions/auth';
// import { Button, Form, Icon, Segment, Divider, Label } from 'semantic-ui-react';
// import { isEmail } from 'validator';
// import { firebase } from '../firebase/firebase';


export class PianoLayout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // emailVal: '',
      // passwordVal: '',
      // emailError: '',
      // passwordError: '',
    }
  }

  playPiano = (e) => {
    
    if (e.state) {
      this.props.synth.triggerAttack(e.note);
    } else {
      this.props.synth.triggerRelease();
    }
    
  }

  pianoReady = (piano) => {
    // console.log(piano);

    // let g = true;
    // setInterval(() => {
    //   if (g) {
    //     piano.toggleKey(60, g);
    //     g = false;
    //   } else {
    //     piano.toggleKey(60, g);
    //     g = true;
    //   }
    // }, 90);
  }

  render() {
    return (
      <div>
        <Piano onReady={this.pianoReady} onChange={this.playPiano} lowNote={60} highNote={72}/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // googleLogin: () => dispatch(googleLogin())
});

export default connect(undefined, mapDispatchToProps)(PianoLayout);




