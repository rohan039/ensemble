/*
  Modified implementation of a react knob component from:

  https://codepen.io/bbx/pen/QBKYOy

  Original Author: Daniel Subat
  MIT Licence
*/
import React from 'react';
import '../../css/knob.css';

var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

class Knob extends React.Component {

  constructor(props) {
    super(props);
    this.startAngle = (360 - props.degrees) / 2;
    this.endAngle = this.startAngle + props.degrees;
    this.margin = props.size * 0.1;
    
    this.state = {
      deg: this.getDeg(this.props.value),
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.value !== nextProps.value) {
      this.setState({ deg: this.getDeg(nextProps.value) })
    }
  }

  map_range = (value, low1, high1, low2, high2) => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  startDrag = e => {
    e.preventDefault();

    let oldx = 0;
    let val = this.props.value;
    let scaler = 0;
    const moveHandler = e => {


      if (keys['16']) {
        scaler = 635;
      } else {
        scaler = 30;
      }

      if (Math.abs(this.props.max) > Math.abs(this.props.min)) {
        if (e.pageX < oldx) {
          val -= Math.abs(this.props.max) / scaler;
        } else if (e.pageX > oldx) {
          val += Math.abs(this.props.max) / scaler;
        }
      } else {
        if (e.pageX < oldx) {
          val -= Math.abs(this.props.min) / scaler;
        } else if (e.pageX > oldx) {
          val += Math.abs(this.props.min) / scaler;
        }
      }

      oldx = e.pageX;

      if (val > this.props.max) {
        val = this.props.max;
      }
      if (val < this.props.min) {
        val = this.props.min;
      }

      this.setState({ deg: this.getDeg(val) });
      
      this.props.onChange(val);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      console.log('mouseup');
      
      document.removeEventListener("mousemove", moveHandler);
    });
  };

  getDeg = (value) => {
    return this.map_range(value, this.props.min, this.props.max, 0, 360);
  };

  renderTicks = () => {
    let ticks = [];
    const incr = this.props.degrees / this.props.numTicks;
    const size = this.margin + this.props.size / 2;
    for (let deg = this.startAngle; deg <= this.endAngle; deg += incr) {
      const tick = {
        deg: deg,
        tickStyle: {
          height: size + 10,
          left: size - 1,
          top: size + 2,
          transform: "rotate(" + deg + "deg)",
          transformOrigin: "top"
        }
      };
      ticks.push(tick);
    }
    return ticks;
  };

  dcpy = o => {
    return JSON.parse(JSON.stringify(o));
  };

  render() {
    let kStyle = {
      width: this.props.size,
      height: this.props.size
    };
    let iStyle = this.dcpy(kStyle);
    let oStyle = this.dcpy(kStyle);
    oStyle.margin = this.margin;
    if (this.props.color) {
      oStyle.backgroundImage =
        "radial-gradient(100% 70%,hsl(200, " + this.state.deg + "%, " +  this.state.deg / 5 +
        "%),hsl(" +
        Math.random() * 100 +
        ",20%," +
        this.state.deg / 36 +
        "%))";
    }
    iStyle.transform = "rotate(" + this.state.deg + "deg)";

    return (
      <div className="knob" style={kStyle}>
        <div className="ticks">
          {this.props.numTicks
            ? this.renderTicks().map((tick, i) => (
              <div
                key={i}
                className={
                  "tick" + (tick.deg <=  this.state.deg ? " active" : "")
                }
                style={tick.tickStyle}
              />
            ))
            : null}
        </div>
        <div className="knob outer" style={oStyle} onMouseDown={this.startDrag}>
          <div className="knob inner" style={iStyle}>
            <div className="grip" />
          </div>
        </div>
      </div>
    );
  }
}

export default Knob;