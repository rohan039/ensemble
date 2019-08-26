import React from 'react';
import { Piano } from 'react-nexusui';

export class PianoLayout extends React.PureComponent {
  
  render() {
    return (
      <div>
        <Piano size={[900,120]} onReady={this.props.keysReady} onChange={this.props.playPiano} lowNote={0} highNote={120} />
      </div>
    )
  }
}

export default PianoLayout;




