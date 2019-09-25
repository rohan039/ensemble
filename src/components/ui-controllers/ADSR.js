import React from 'react';
import * as _ from 'lodash';
import '../../css/adsr.css';

class ASDR extends React.PureComponent {

  constructor(props) {
    super(props);
    this.position = {
      a: {
        x: 10, y: 20
      },
      d: {
        x: 120, y: 100
      },
      s: {
        x: 300, y: 100
      },
      r: {
        x: 340, y: 200
      }
    }

    this.mapPosToVals(this.position)

    this.strokeCol = '#3888f5';
    this.circFill = '#FFF';
    this.backFill = '#FFF';
    this.dashStrokeCol = '#6ca6f5';
    this.borderFill = '#FFF'

    this.throttledUpdate = _.throttle(this.updatePosVals, 20)
  }

  handleMouseDown = e => {
    const pageX = e.pageX
    const pageY = e.pageY

    this.position = {
      ...this.position,
      coords: {
        x: pageX,
        y: pageY,
      }
    }
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  updatePosVals = (e) => {
    const xDiff = this.position.coords.x - e.pageX
    const yDiff = this.position.coords.y - e.pageY

    if (Math.abs(xDiff) > this.props.radius) {
      document.removeEventListener('mousemove', this.handleMouseMove)
      this.props.onChange(this.mapPosToVals(this.position));
    }


    switch (e.target.id) {
      case 'A':

        if (this.position.a.x - xDiff > 0 && this.position.a.x - xDiff < this.position.d.x) {
          this.position = {
            ...this.position,
            a: {
              x: this.position.a.x - xDiff,
              y: this.position.a.y,
            },
            coords: {
              x: e.pageX,
              y: e.pageY,
            },
          }
        }

        if (this.position.a.y - yDiff > 0 && this.position.a.y - yDiff < 201) {
          this.position = {
            ...this.position,
            a: {
              x: this.position.a.x,
              y: this.position.a.y - yDiff,
            },
            coords: {
              x: e.pageX,
              y: e.pageY,
            },
          }
        }

        e.target.setAttribute("cx", this.position.a.x);
        e.target.setAttribute("cy", this.position.a.y);

        document.getElementById('ALine').setAttribute('x2', this.position.a.x)
        document.getElementById('ALine').setAttribute('y2', this.position.a.y)

        document.getElementById('DLine').setAttribute('x1', this.position.a.x)
        document.getElementById('DLine').setAttribute('y1', this.position.a.y)

        document.getElementById('vertALine').setAttribute('x1', this.position.a.x)
        document.getElementById('vertALine').setAttribute('x2', this.position.a.x)

        break;
      case 'D':
        if (this.position.d.x - xDiff > this.position.a.x && this.position.d.x - xDiff < this.position.s.x) {
          this.position = {
            ...this.position,
            d: {
              x: this.position.d.x - xDiff,
              y: this.position.d.y,
            },
            s: {
              x: this.position.s.x,
              y: this.position.d.y,
            },
            coords: {
              x: e.pageX,
              y: e.pageY,
            },
          }
        }

        if (this.position.d.y - yDiff > 0 && this.position.d.y - yDiff < 201) {
          this.position = {
            ...this.position,
            d: {
              x: this.position.d.x,
              y: this.position.d.y - yDiff,
            },
            s: {
              x: this.position.s.x,
              y: this.position.d.y - yDiff,
            },
            coords: {
              x: e.pageX,
              y: e.pageY,
            },
          }
        }

        e.target.setAttribute("cx", this.position.d.x);
        e.target.setAttribute("cy", this.position.d.y);

        document.getElementById('S').setAttribute('cy', this.position.s.y)

        document.getElementById('SLine').setAttribute('x1', this.position.d.x)
        document.getElementById('SLine').setAttribute('y1', this.position.s.y)

        document.getElementById('SLine').setAttribute('y2', this.position.s.y)
        document.getElementById('RLine').setAttribute('y1', this.position.s.y)

        document.getElementById('DLine').setAttribute('x2', this.position.d.x)
        document.getElementById('DLine').setAttribute('y2', this.position.s.y)

        document.getElementById('vertDLine').setAttribute('x1', this.position.d.x)
        document.getElementById('vertDLine').setAttribute('x2', this.position.d.x)

        break;
      case 'S':


        if (this.position.s.y - yDiff > 0 && this.position.s.y - yDiff < 201) {
          this.position = {
            ...this.position,
            d: {
              x: this.position.d.x,
              y: this.position.s.y - yDiff,
            },
            s: {
              x: this.position.s.x,
              y: this.position.s.y - yDiff,
            },

            coords: {
              x: e.pageX,
              y: e.pageY,
            },
          }
        }

        e.target.setAttribute("cx", this.position.s.x);
        e.target.setAttribute("cy", this.position.s.y);

        document.getElementById('D').setAttribute('cy', this.position.s.y)

        document.getElementById('DLine').setAttribute('x2', this.position.d.x)
        document.getElementById('DLine').setAttribute('y2', this.position.s.y)

        document.getElementById('SLine').setAttribute('y1', this.position.s.y)

        document.getElementById('SLine').setAttribute('x2', this.position.s.x)
        document.getElementById('SLine').setAttribute('y2', this.position.s.y)

        document.getElementById('RLine').setAttribute('x1', this.position.s.x)
        document.getElementById('RLine').setAttribute('y1', this.position.s.y)

        document.getElementById('vertSLine').setAttribute('x1', this.position.s.x)
        document.getElementById('vertSLine').setAttribute('x2', this.position.s.x)

        break;

      case 'R':
        if (this.position.r.x - xDiff > this.position.s.x && this.position.r.x - xDiff < 400) {
          this.position = {
            ...this.position,
            r: {
              x: this.position.r.x - xDiff,
              y: this.position.r.y,
            },
            coords: {
              x: e.pageX,
              y: e.pageY,
            },
          }
        }

        e.target.setAttribute("cx", this.position.r.x);
        e.target.setAttribute("cy", this.position.r.y);

        document.getElementById('RLine').setAttribute('x2', this.position.r.x)
        document.getElementById('RLine').setAttribute('y2', this.position.r.y)

        document.getElementById('vertRLine').setAttribute('x1', this.position.r.x)
        document.getElementById('vertRLine').setAttribute('x2', this.position.r.x)

        break;
      default:
        break;
    }

    this.props.onChange(this.mapPosToVals(this.position));

    document.getElementById('peakText').innerHTML = 'A Amp: -' + parseFloat(this.values.ampMaxValPerc).toFixed(2) + 'dB';
    document.getElementById('AText').innerHTML = 'A: ' + parseFloat(this.values.attack).toFixed(2) + 's';
    document.getElementById('DText').innerHTML = 'D: ' + parseFloat(this.values.decay).toFixed(2) + 's';
    document.getElementById('SText').innerHTML = 'S: ' + parseFloat(this.values.sustain * 100).toFixed(0) + '%';
    document.getElementById('RText').innerHTML = 'R: ' + parseFloat(this.values.release).toFixed(2) + 's';

    this.mapPosToVals(this.position)
  }

  handleMouseMove = (e) => {
    // e.persist();

    this.throttledUpdate(e)


  }

  handleMouseUp = (e) => {
    document.removeEventListener('mousemove', this.handleMouseMove)
   
    this.position = {
      ...this.position,
      coords: {}
    }
  }

  map_range = (value, low1, high1, low2, high2) => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  // mapValsToPos = (vals) => {
  //   let ampMaxValPerc = 1 - this.map_range(vals[], 0, -50, 4, 200, );

  //   if (ampMaxValPerc < 0) ampMaxValPerc = 0;
  //   // A range
  //   // Input 0 - D.x
  //   // Output 0 - 7

  //   let attack = this.map_range(
  //     Math.pow(pos.a.x, 2),
  //     0, Math.pow(pos.d.x, 2),
  //     0, 7);

  //   // D range
  //   // A.x - 300
  //   // Output 0 - 7

  //   let decay = this.map_range(
  //     Math.pow(pos.d.x, 2),
  //     Math.pow(pos.a.x, 2), Math.pow(300, 2),
  //     0, 7
  //   );

  //   // decay = decay - attack;
  //   // S range
  //   // in: 0 - 200
  //   // out: 0 - 100%

  //   //linear map
  //   let sustain = this.map_range(pos.s.y, 0, 200, 1, 0);

  //   // R Range 
  //   // Input 300 - 400
  //   // Output 0 - 20
  //   let release = this.map_range(

  //     Math.pow((pos.r.x - 300), 2),
  //     0, Math.pow(100, 2),
  //     0, 20
  //   );

  //   this.values = {
  //     ampMaxValPerc, attack, decay, sustain, release
  //   }

  //   return this.values;
  // }

  mapPosToVals = (pos) => {
    let ampMaxValPerc = 1 - this.map_range(pos.a.y, 4, 200, 0, -50);

    if (ampMaxValPerc < 0) ampMaxValPerc = 0;
    // A range
    // Input 0 - D.x
    // Output 0 - 7

    let attack = this.map_range(
      Math.pow(pos.a.x, 2),
      0, Math.pow(pos.d.x, 2),
      0, 7);

    // D range
    // A.x - 300
    // Output 0 - 7

    let decay = this.map_range(
      Math.pow(pos.d.x, 2),
      Math.pow(pos.a.x, 2), Math.pow(300, 2),
      0, 7
    );

    // decay = decay - attack;
    // S range
    // in: 0 - 200
    // out: 0 - 100%

    //linear map
    let sustain = this.map_range(pos.s.y, 0, 200, 1, 0);

    // R Range 
    // Input 300 - 400
    // Output 0 - 20
    let release = this.map_range(

      Math.pow((pos.r.x - 300), 2),
      0, Math.pow(100, 2),
      0, 20
    );

    this.values = {
      ampMaxValPerc, attack, decay, sustain, release
    }

    return this.values;

  }

  render() {
    return (
      <div>
        <h4 style={{ 'paddingBottom': '1em'}}>{this.props.title}</h4>
        <svg className="svgClass" width="400" height="250">

          <rect x="0" y="0" width="400" height="230" fill={this.borderFill} />
          <rect x="0" y="0" width="400" height="200" fill={this.backFill} />
          <line x1='0' y1='200' x2='400' y2='200' strokeWidth='3' stroke={this.strokeCol} />

          <line id='vertALine' x1={this.position.a.x} y1='0' x2={this.position.a.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} strokeDasharray="12" />
          <line id='vertDLine' x1={this.position.d.x} y1='0' x2={this.position.d.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} strokeDasharray="12" />
          <line id='vertSLine' x1={this.position.s.x} y1='0' x2={this.position.s.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} strokeDasharray="12" />
          <line id='vertRLine' x1={this.position.r.x} y1='0' x2={this.position.r.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} strokeDasharray="12" />

          <line id='ALine' x1='0' y1='200' x2={this.position.a.x} y2={this.position.a.y} strokeWidth='3' stroke={this.strokeCol} />
          <line id='DLine' x1={this.position.a.x} y1={this.position.a.y} x2={this.position.d.x} y2={this.position.s.y} strokeWidth='3' stroke={this.strokeCol} />
          <line id='SLine' x1={this.position.d.x} y1={this.position.s.y} x2={300} y2={this.position.s.y} strokeWidth='3' stroke={this.strokeCol} />
          <line id='RLine' x1={300} y1={this.position.s.y} x2={this.position.r.x} y2={200} strokeWidth='3' stroke={this.strokeCol} />


          <text onDragStart={() => false} onMouseDown={() => false} id='peakText' x="8" stroke={this.strokeCol} y="221" >A Amp: -{parseFloat(this.values.ampMaxValPerc).toFixed(0)}dB</text>
          <text onDragStart={() => false} onMouseDown={() => false} id='AText' x="135" stroke={this.strokeCol} y="221" >A: {parseFloat(this.values.attack).toFixed(2)}s</text>
          <text onDragStart={() => false} onMouseDown={() => false} id='DText' x="200" stroke={this.strokeCol} y="221" >D: {parseFloat(this.values.decay).toFixed(2)}s</text>
          <text onDragStart={() => false} onMouseDown={() => false} id='SText' x="265" stroke={this.strokeCol} y="221" >S: {parseFloat(this.values.sustain * 100).toFixed(0)}%</text>
          <text onDragStart={() => false} onMouseDown={() => false} id='RText' x="320" stroke={this.strokeCol} y="221" >R: {parseFloat(this.values.release).toFixed(2)}s</text>

          <circle
            cx={this.position.a.x}
            cy={this.position.a.y}
            r={this.props.radius}
            fill={this.circFill}
            stroke={this.strokeCol}
            strokeWidth="3"
            id='A'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onDragStart={() => false} 
     
          />

          <circle
            cx={this.position.s.x}
            cy={this.position.s.y}
            r={this.props.radius}
            fill={this.circFill}
            stroke={this.strokeCol}
            strokeWidth="3"
            id='S'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onDragStart={() => false} 
       
          />
          <circle
            cx={this.position.d.x}
            cy={this.position.d.y}
            r={this.props.radius}
            fill={this.circFill}
            stroke={this.strokeCol}
            strokeWidth="3"
            id='D'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onDragStart={() => false} 
         
          />
          <circle
            cx={this.position.r.x}
            cy={this.position.r.y}
            r={this.props.radius}
            fill={this.circFill}
            stroke={this.strokeCol}
            strokeWidth="3"
            id='R'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onDragStart={() => false} 
        
          />




        </svg>
      </div>
    );
  }
}

export default ASDR;





