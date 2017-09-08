import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/js/App';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toMaps = function () {
  this.cardType = 'Map';
}

ProtoGraph.Card.toMaps.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toMaps.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toMaps.prototype.renderLaptop = function () {
  let dimension = getScreenSize();
  if (dimension.width <= 400){
    this.mode = 'mobile';
  } else {
    this.mode = 'laptop';
  } 
  ReactDOM.render(
    <App
      dataURL={this.options.dataURL}
      topoURL={this.options.topoURL}
      chartOptions={this.options.chartOptions}
      filterNames={this.options.filterNames}
      filterHeaders={this.options.filterHeaders}
      mode={this.mode}
      dimensionWidth = {dimension.width}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

function getScreenSize() {
  let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight|| e.clientHeight|| g.clientHeight;

  return {
    width: width,
    height: height
  };
}

// ReactDOM.render(<App dataURL='src/data/data.json'/>, document.getElementById('card-list-div'));


