import React from 'react';
import { VictoryBar, VictoryChart, VictoryBrushContainer, VictoryAxis} from 'victory';
import axios from 'axios';
import {timeFormat} from 'd3-time-format';

class TimeBrush extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sorted_arr: undefined
    }
  }

  componentWillMount() {
    let parseDate = timeFormat("%Y-%m");

    let num_incidents = [];
    this.props.dataJSON.map(function (d){
      num_incidents.push(parseDate(new Date(d.date)));
    });

    let count_obj = this.count(num_incidents),
      count = Object.values(count_obj);

    // console.log(count_obj, "count_obj")
    let arr=[], j=0;
    for (let i in count_obj) {
      arr[j] = ({
        "year": i,
        "date_obj": new Date(i),
        "count": count_obj[i] 
      })
      j++
    }
    let sorted_arr = this.sortArray(arr);

    this.setState({
      sorted_arr: sorted_arr
    })
  }

  count(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
  }

  sortArray (arr){
    let new_arr = arr.sort(function (a, b) {
      let key1 = new Date(a.year),
        key2 = new Date(b.year);
      if (key1 > key2) {
        return 1;
      } else if (key1 == key2) {
        return 0;
      } else {
        return -1;
      }
    });
    return new_arr;
  }

  render() {
    let start_domain, end_domain;
    if (this.props.start_domain === 'undefined' && this.props.end_domain === 'undefined'){
      start_domain = this.state.sorted_arr[0].date_obj;
      end_domain = this.state.sorted_arr[this.state.sorted_arr.length -1].date_obj;
    } else {
      start_domain = this.props.start_domain;
      end_domain = this.props.end_domain;
    }
    return (
      <VictoryChart 
        domainPadding={10}
        width={300} height={120} padding={{left:20, right: 20, top:10, bottom:50}}
        scale={{x: "time"}}
        containerComponent={
          <VictoryBrushContainer
            selectedDomain={{x:[start_domain, end_domain]}}
            dimension="x" 
            responsive={this.props.mode === 'mobile' ? true : false}
            handleStyle={{fill: "#bdb8b8", height: 27, y:25, width: 7}}
            selectionStyle={{stroke: "transparent", fill: "black", fillOpacity: 0.1}}
            onDomainChange={(domain) => this.props.handleSelectDateRange(domain)}/>
        }
      > 
        <VictoryAxis
          fixLabelOverlap={true}
          style={{
            axis: {stroke: "#bdb8b8", strokeWidth: 0.5},
            axisLabel: {fontSize: 10},
            ticks: {stroke: "#bdb8b8", size: 5},
            tickLabels: {fontSize: 10}
          }}/>

        <VictoryBar
          style={{ data: { fill: "#F02E2E" } }}
          padding={{left: 20, right: 20, bottom:50}}
          data={this.state.sorted_arr}
          x="date_obj"
          y="count"/>

      </VictoryChart>
    )
  }
}

export default TimeBrush;