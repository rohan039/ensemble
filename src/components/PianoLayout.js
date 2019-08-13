import React from 'react';
import { Piano } from 'react-nexusui';

export class PianoLayout extends React.PureComponent {
  
  render() {
    return (
      <div>
        <Piano onReady={this.props.keysReady} onChange={this.props.playPiano} lowNote={36} highNote={108} />
      </div>
    )
  }
}

export default PianoLayout;




