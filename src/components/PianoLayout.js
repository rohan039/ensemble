import React from 'react';
import { Piano } from 'react-nexusui';

export class PianoLayout extends React.PureComponent {

  render() {
    return (
      <div style={{ 'textAlign': 'center' }}>
        <div style={{ 'display': 'inline-block' }}>
          <Piano size={[920, 100]} onReady={this.props.keysReady} onChange={this.props.playPiano} lowNote={0} highNote={120} />
        </div>
      </div>
    )
  }
}

export default PianoLayout;




