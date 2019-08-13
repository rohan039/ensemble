import React from 'react';

class ASDR extends React.Component {

  constructor(props) {
    super(props);
    this.position = {
      a: {
        x: 50, y: 20
      },
      d: {
        x: 120, y: 100
      },
      s: {
        x: 300, y: 100
      },
      r: {
        x: 380, y: 200
      }
    }

    this.strokeCol = '#3888f5';
    this.circFill = '#FFF';
    this.backFill = '#FFF';
    this.dashStrokeCol = '#6ca6f5';
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

  handleMouseMove = (e) => {

    const xDiff = this.position.coords.x - e.pageX
    const yDiff = this.position.coords.y - e.pageY

    if (Math.abs(xDiff) > this.props.radius) {
      document.removeEventListener('mousemove', this.handleMouseMove)
      this.props.onChange(this.position);
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
  }

  handleMouseUp = (e) => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    this.props.onChange(this.position);
    this.position = {
      ...this.position,
      coords: {}
    }

  }

  render() {
    return (
      <div>
        <h4 >Envelope</h4>
        <svg className="svgClass" width="420" height="250" style={{ 'margin': '10px' }}>
          <rect x="0" y="0" width="400" height="200" fill={this.backFill} />

          <line id='vertALine' x1={this.position.a.x} y1='0' x2={this.position.a.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} stroke-dasharray="10" />
          <line id='vertDLine' x1={this.position.d.x} y1='0' x2={this.position.d.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} stroke-dasharray="10" />
          <line id='vertSLine' x1={this.position.s.x} y1='0' x2={this.position.s.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} stroke-dasharray="10" />
          <line id='vertRLine' x1={this.position.r.x} y1='0' x2={this.position.r.x} y2='200' strokeWidth='1' stroke={this.dashStrokeCol} stroke-dasharray="10" />

          <line id='ALine' x1='0' y1='200' x2={this.position.a.x} y2={this.position.a.y} strokeWidth='3' stroke={this.strokeCol} />
          <line id='DLine' x1={this.position.a.x} y1={this.position.a.y} x2={this.position.d.x} y2={this.position.s.y} strokeWidth='3' stroke={this.strokeCol} />
          <line id='SLine' x1={this.position.d.x} y1={this.position.s.y} x2={300} y2={this.position.s.y} strokeWidth='3' stroke={this.strokeCol} />
          <line id='RLine' x1={300} y1={this.position.s.y} x2={this.position.r.x} y2={200} strokeWidth='3' stroke={this.strokeCol} />



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
          />

          

        </svg>
      </div>
    );
  }
}

export default ASDR;





