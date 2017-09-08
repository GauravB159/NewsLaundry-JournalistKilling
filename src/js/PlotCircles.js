import React from 'react';
import Util from '../js/Utils';

class PlotCircles extends React.Component { 
  setColor(card) {
    let groupCat = Util.groupBy(this.props.dataJSON, this.props.chartOptions.colorCategory),
      colorDomain = Object.keys(groupCat);
    let color = Util.setColorScale(card, colorDomain, this.props.chartOptions.colorRange)
    
    return color;
  }

  render() {
    if (this.props.dataJSON === undefined) {
      return(<div></div>)
    } else {
      const {colorCategory, defaultCircleColor} = this.props.chartOptions;
      const circles = this.props.dataJSON.map((point, i) => {
        return(
          <circle id="map_circles"
            className={`map-circles circle-${point.view_cast_id}-${point.area}`}
            key={i} 
            cx={this.props.projection([point.lng, point.lat])[0]} 
            cy={this.props.projection([point.lng, point.lat])[1]} 
            r={3}
            fill={defaultCircleColor}>
          </circle>
        )
      });
      return(
        <g>{circles}</g>
      )
    }
  }
}

export default PlotCircles;
