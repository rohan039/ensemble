import React from 'react';
import { connect } from 'react-redux';
// import { googleLogin } from '../actions/auth';
// import { Button, Form, Icon, Segment, Divider, Label } from 'semantic-ui-react';
// import { isEmail } from 'validator';
// import { firebase } from '../firebase/firebase';

export class FxContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      emailVal: '',
      passwordVal: '',
      emailError: '',
      passwordError: '',
    }
  }


  render() {
    return (
      <div style={{'background': '#84dbb7'}}>
        Fx Controller
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // googleLogin: () => dispatch(googleLogin())
});

export default connect(undefined, mapDispatchToProps)(FxContainer);




