import React from 'react';
import * as topojson from 'topojson-client';
import {geoPath, geoCentroid, geoMercator} from 'd3-geo';
import PlotCircles from '../js/PlotCircles';
import Voronoi from '../js/Voronoi';

class MapsCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projection: undefined,
      regions: [],
      outlines: [],
      country: undefined,
      path: undefined,
      offsetWidth: undefined,
      actualHeight: undefined
    }
  }

  componentWillMount() {
    let padding = this.props.mode === 'mobile' ? 20 : 0,
      offsetWidth = this.props.mode === 'mobile' ? 320 : 550 - padding ,
      actualHeight = this.props.mode === 'mobile' ? 500 : this.props.chartOptions.height

    let tx = this.props.mode === 'mobile' ? offsetWidth / 2 : offsetWidth / 2;

    let ch = this.props.topoJSON,
      country = topojson.feature(ch, ch.objects),
      center = geoCentroid(topojson.feature(ch, ch.objects)),
      scale = 700,
      projection = geoMercator().center(center)
        .scale(scale)
        .translate([tx, actualHeight/2]),
      path = geoPath()
        .projection(projection);

    let bounds  = path.bounds(country),
      hscale = scale*offsetWidth  / (bounds[1][0] - bounds[0][0]),
      vscale = scale*actualHeight / (bounds[1][1] - bounds[0][1]);
    scale = (hscale < vscale) ? hscale : vscale;
    let offset = [offsetWidth - (bounds[0][0] + bounds[1][0])/2, actualHeight - (bounds[0][1] + bounds[1][1])/2];

    projection = geoMercator().center(center)
      .scale(scale)
      .translate(offset);
    path = path.projection(projection);

    let regions = country.features.map((d,i) => {
      return(
        <g key={i} className="region">
          <path className="geo-region" d={path(d)}></path>
        </g>
      )
    })

    let outlines = country.features.map((d,i) => {
      return(
        <path key={i} className="geo region-outline" d={path(d)}></path>
      )
    })

    this.setState({
      projection: projection,
      regions: regions,
      outlines: outlines,
      country: country,
      path: path,
      offsetWidth: offsetWidth,
      actualHeight: actualHeight
    })
  }

  render(){
    let styles = {
      strokeWidth: 0.675
    }
    const {projection, regions, outlines, country, path, offsetWidth, actualHeight} = this.state
    return(
      <svg id='map_svg' viewBox={`0, 0, ${offsetWidth}, ${actualHeight}`} width={offsetWidth} height={actualHeight}>
        <g id="regions-grp" className="regions">{regions}</g>
        <path className='geo-borders' d={path(country)}></path>
        <g className="outlines" style={styles}>{outlines}</g>
        <PlotCircles dataJSON={this.props.dataJSON} projection={projection} chartOptions={this.props.chartOptions} height={actualHeight} width={offsetWidth} />
        <Voronoi data={this.props.dataJSON} projection={projection} width={offsetWidth} height={actualHeight} mode={this.props.mode} circleClicked={this.props.circleClicked} handleCircleClicked={this.props.handleCircleClicked} circleHover={this.props.circleHover}/>
      </svg>
    )
  }
}

export default MapsCard;
