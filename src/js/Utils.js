import {scaleOrdinal as d3ScaleOrdinal} from 'd3-scale';
import {timeFormat} from 'd3-time-format';

function setColorScale(value, colorDomain, colorRange) {
  let colorScale = d3ScaleOrdinal()
    .domain(colorDomain)
    .range(colorRange);

  return colorScale(value);
}

function highlightCircle(name, data) {
  let getCircles = document.getElementsByClassName(`circle-${name}`),
    allCircles = document.getElementsByClassName('map-circles');
  // remove highlight of previous circle
  for (let j=0; j<allCircles.length; j++){
    allCircles[j].r.baseVal.value = 3    
  }
  for (let i=0; i<getCircles.length; i++){
    getCircles[i].r.baseVal.value = 5 
  }
}

function formatDate(date) {
  let parseTime = timeFormat("%B '%Y");
  // console.log(parseTime(new Date(date)), "inside parse function")
  return parseTime(new Date(date));
}

function groupBy(data, column) {
  let grouped_data = {};
  switch(typeof column) {
    case "string":
      data.forEach(datum => {
        if(grouped_data[datum[column]]) {
          grouped_data[datum[column]].push(datum);
        } else {
          grouped_data[datum[column]] = [datum];
        }
      });
      break;
    case "function":
      data.forEach(datum => {
        let key = column(datum);
        if(grouped_data[key]) {
          grouped_data[key].push(datum);
        } else {
          grouped_data[key] = [datum];
        }
      });
      break;
  }
  return grouped_data;
}

module.exports = {
  groupBy : groupBy,
  setColorScale : setColorScale,
  highlightCircle: highlightCircle,
  formatDate: formatDate
}