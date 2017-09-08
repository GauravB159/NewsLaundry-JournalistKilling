import React from 'react';
import axios from 'axios';
import Halogen from 'halogen';
import List from '../js/List';
import Map from '../js/Map';
import TimeBrush from '../js/TimeBrush';
import Utils from '../js/Utils';
import {timeFormat} from 'd3-time-format';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataJSON: undefined,
      filteredJSON: undefined,
      circleClicked: false,
      circleHover: false,
      height: 0,
      overflow: 'hidden',
      showTapArea: 'block',
      hideTapArea: 'none',
      topoJSON: {},
      category: null,
      menu: [],
      state: [],
      victim_religion: [],
      accused_religion: [],
      police_vehicles: [],
      police_intervene: [],
      village_defence_force: [],
      police_to_population: [],
      judge_to_population: [],
      police_prevent_death:[],
      party: [],
      lynching_planned: [],
      criminalise_victims: [], 
      area_classification: [], 
      menu_value: 'undefined',
      party_value: 'undefined',
      state_value: 'undefined',
      victim_religion_value: 'undefined',
      accused_religion_value: 'undefined',
      police_to_population_value: 'undefined',
      police_vehicles_value: 'undefined',
      village_defence_force_value: 'undefined',
      judge_to_population_value: 'undefined',
      police_prevent_death_value: 'undefined',
      lynching_planned_value: 'undefined',
      criminalise_victims_value: 'undefined',
      area_classification_value: 'undefined',
      police_intervene_value: 'undefined',
      year_value: {
        min: 'undefined',
        max: 'undefined'
      },
      start_domain: 'undefined',
      end_domain: 'undefined',
      parseMonth: timeFormat("%Y-%m")
    }
    this.handleCircleClicked = this.handleCircleClicked.bind(this);
    this.handleSelectDateRange = this.handleSelectDateRange.bind(this);
  }

  componentDidMount() {
    const {dataURL, topoURL} = this.props;
    axios.all([axios.get(dataURL), axios.get(topoURL)])
      .then(axios.spread((card, topo) => {
        this.setState({
          dataJSON: card.data,
          filteredJSON: card.data,
          topoJSON: topo.data
        });
        let menu = this.sortObject(Utils.groupBy(this.state.dataJSON, 'classification')),
          party = this.sortObject(Utils.groupBy(this.state.dataJSON, 'party_whose_chief_minister_is_in_power')),
          state = this.sortObject(Utils.groupBy(this.state.dataJSON, 'state')),
          victim_religion = this.sortObject(Utils.groupBy(this.state.dataJSON, 'victim_social_classification')),
          accused_religion = this.sortObject(Utils.groupBy(this.state.dataJSON, 'accused_social_classification')),
          police_to_population = this.sortObject(Utils.groupBy(this.state.dataJSON, 'police_to_population')),
          judge_to_population = this.sortObject(Utils.groupBy(this.state.dataJSON, 'judge_to_population')),
          police_prevent_death = this.sortObject(Utils.groupBy(this.state.dataJSON, 'did_the_police_intervention_prevent_death')),
          lynching_planned = this.sortObject(Utils.groupBy(this.state.dataJSON, 'was_incident_planned')),
          criminalise_victims = this.sortObject(Utils.groupBy(this.state.dataJSON, 'does_the_state_criminalise_victims_actions')),
          area_classification = this.sortObject(Utils.groupBy(this.state.dataJSON, 'area_classification')),
          police_vehicles = this.sortObject(Utils.groupBy(this.state.dataJSON, 'police_vehicles_per_km')),
          village_defence_force = this.sortObject(Utils.groupBy(this.state.dataJSON, 'does_state_have_village_defence_force')),
          police_intervene = this.sortObject(Utils.groupBy(this.state.dataJSON, 'did_the_police_intervene'));

        this.setState({
          menu: menu,
          party: party,
          state: state,
          victim_religion: victim_religion,
          accused_religion: accused_religion,
          police_to_population: police_to_population,
          judge_to_population: judge_to_population,
          police_prevent_death: police_prevent_death,
          lynching_planned: lynching_planned,
          criminalise_victims: criminalise_victims,
          area_classification: area_classification,
          police_vehicles:police_vehicles,
          village_defence_force: village_defence_force,
          police_intervene: police_intervene
        })
    }));
    this.showCounter();
  }

  sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        arr.push({
          'key': prop,
          'value': obj[prop].length
        });
      }
    }
    arr.sort(function (a, b) {
      let key1 = a.value,
        key2 = b.value;
      if (key1 > key2) {
        return -1;
      } else if (key1 == key2) {
        return 0;
      } else {
        return 1;
      }
    });
    return arr; // returns array
  }

  handleCircleClicked(bool) {
    this.setState({
      circleClicked: bool
    })
  }

  handleSelectDateRange(domain) {
    let min = this.state.parseMonth(domain.x[0]),
      max = this.state.parseMonth(domain.x[1])
    // console.log(min, max, "hey min and max")
    this.setState((prevState, props) => {
      prevState.year_value = {
        min: min,
        max: max
      };
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        year_value: {
          min: min,
          max: max
        }
      }
    })
  }

  handleOnChangeMenu(e, value) {
    this.setState((prevState, props) => {
      if (prevState.menu_value !== value || prevState.menu_value === 'undefined' ) {
        prevState.menu_value = value; 
        this.highlightItem(value, 'menu_inactive_item', 'menu_active_item', 'menu');
      } else {
        prevState.menu_value = 'undefined';
        this.highlightItem(value, 'menu_inactive_item', 'menu_inactive_item', 'menu');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        menu_value: prevState.menu_value
      }
    })
  }

  handleOnChangeParty(e, value) {
    this.setState((prevState, props) => {
      if (prevState.party_value !== value || prevState.party_value === 'undefined' ) {
        prevState.party_value = value;
        this.highlightItem(value, 'party_inactive_item', 'party_active_item', 'party');
      } else {
        prevState.party_value = 'undefined';
        this.highlightItem(value, 'party_inactive_item', 'party_inactive_item', 'party');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        party_value: prevState.party_value
      }
    })
  }

  handleOnChangeState(e, value) {
    this.setState((prevState, props) => {
      if (prevState.state_value !== value || prevState.state_value === 'undefined' ) {
        prevState.state_value = value;
        this.highlightItem(value, 'state_inactive_item', 'state_active_item', 'state');
      } else {
        prevState.state_value = 'undefined';
        this.highlightItem(value, 'state_inactive_item', 'state_inactive_item', 'state');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        state_value: prevState.state_value
      }
    })
  }

  handleOnChangeVR(e, value) {
    this.setState((prevState, props) => {
      if (prevState.victim_religion_value !== value || prevState.victim_religion_value === 'undefined' ) {
        prevState.victim_religion_value = value;
        this.highlightItem(value, 'victim_inactive_item', 'victim_active_item', 'victim');
      } else {
        prevState.victim_religion_value = 'undefined';
        this.highlightItem(value, 'victim_inactive_item', 'victim_inactive_item', 'victim');
      }     
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        victim_religion_value: prevState.victim_religion_value
      }
    })
  }

  handleOnChangeAR(e, value) {
    this.setState((prevState, props) => {
      if (prevState.accused_religion_value !== value || prevState.accused_religion_value === 'undefined' ) {
        prevState.accused_religion_value = value;
        this.highlightItem(value, 'accused_inactive_item', 'accused_active_item', 'accused');
      } else {
        prevState.accused_religion_value = 'undefined';
        this.highlightItem(value, 'accused_inactive_item', 'accused_inactive_item', 'accused');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        accused_religion_value: prevState.accused_religion_value
      }
    })
  }

  handleOnChangePolice(e, value) {
    this.setState((prevState, props) => {
      if (prevState.police_to_population_value !== value || prevState.police_to_population_value === 'undefined' ) {
        prevState.police_to_population_value = value;
        this.highlightItem(value, 'police_inactive_item','police_active_item', 'police');
      } else {
        prevState.police_to_population_value = 'undefined';
        this.highlightItem(value, 'police_inactive_item','police_inactive_item', 'police');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        police_to_population_value: prevState.police_to_population_value
      }
    })
  }

  handleOnChangeJudge(e, value) {
    this.setState((prevState, props) => {
      if (prevState.judge_to_population_value !== value || prevState.judge_to_population_value === 'undefined') {
        prevState.judge_to_population_value = value;
        this.highlightItem(value, 'judge_inactive_item','judge_active_item', 'judge');
      } else {
        prevState.judge_to_population_value = 'undefined';
        this.highlightItem(value, 'judge_inactive_item','judge_inactive_item', 'judge');
      }     
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        judge_to_population_value: prevState.judge_to_population_value
      }
    })
  }

  handleOnChangePolicePrevent(e, value) {
    this.setState((prevState, props) => {
      if(prevState.police_prevent_death_value !== value || prevState.police_prevent_death_value === 'undefined') {
        prevState.police_prevent_death_value = value;
        this.highlightItem(value, 'police_prevent_inactive_item','police_prevent_active_item', 'police-prevent');
      } else {
        prevState.police_prevent_death_value = 'undefined';
        this.highlightItem(value, 'police_prevent_inactive_item','police_prevent_inactive_item', 'police-prevent');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        police_prevent_death_value: prevState.police_prevent_death_value
      }
    })
  }

  handleOnChangeLynchingPlanned(e, value) {
    this.setState((prevState, props) => {
      if (prevState.lynching_planned_value !== value || prevState.lynching_planned_value === 'undefined') {
        prevState.lynching_planned_value = value;
        this.highlightItem(value, 'lynching_inactive_item','lynching_active_item', 'lynching');
      } else {
        prevState.lynching_planned_value = 'undefined';
        this.highlightItem(value, 'lynching_inactive_item','lynching_inactive_item', 'lynching');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        lynching_planned_value: prevState.lynching_planned_value
      }
    })
  }

  handleOnChangeArea(e, value){
    this.setState((prevState, props) => {
      if (prevState.area_classification_value !== value || prevState.area_classification_value === 'undefined') {
        prevState.area_classification_value = value;
        this.highlightItem(value, 'area_inactive_item','area_active_item', 'area');
      } else {
        prevState.area_classification_value = 'undefined';
        this.highlightItem(value, 'area_inactive_item','area_inactive_item', 'area');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        area_classification_value: prevState.area_classification_value
      }
    })
  }

  handleOnChangePoliceVehicles(e, value) {
    this.setState((prevState, props) => {
      if (prevState.police_vehicles_value !== value || prevState.police_vehicles_value === 'undefined') {
        prevState.police_vehicles_value = value;
        this.highlightItem(value, 'police_vehicles_inactive_item','police_vehicles_active_item', 'police-vehicles');
      } else {
        prevState.police_vehicles_value = 'undefined';
        this.highlightItem(value, 'police_vehicles_inactive_item','police_vehicles_inactive_item', 'police-vehicles');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        police_vehicles_value: prevState.police_vehicles_value
      }
    })
  }

  handleOnChangeVillageDefenseForce(e, value) {
    this.setState((prevState, props) => {
      if (prevState.village_defence_force_value !== value || prevState.village_defence_force_value === 'undefined') {
        prevState.village_defence_force_value = value;
        this.highlightItem(value, 'defence_force_inactive_item','defence_force_active_item', 'defence-force');
      } else {
        prevState.village_defence_force_value = 'undefined';
        this.highlightItem(value, 'defence_force_inactive_item','defence_force_inactive_item', 'defence-force');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        village_defence_force_value: prevState.village_defence_force_value
      }
    })
  }

  handleOnChangePoliceIntervene(e, value) {
    this.setState((prevState, props) => {
      if (prevState.police_intervene_value !== value || prevState.police_intervene_value === 'undefined') {
        prevState.police_intervene_value = value;
        this.highlightItem(value, 'police_intervene_inactive_item','police_intervene_active_item', 'police-intervene');
      } else {
        prevState.police_intervene_value = 'undefined';
        this.highlightItem(value, 'police_intervene_inactive_item','police_intervene_inactive_item', 'police-intervene');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        police_intervene_value: prevState.police_intervene_value
      }
    })
  }

  handleReset(e) {
    this.setState({
      filteredJSON: this.state.dataJSON,
      category: null
    })
    if (this.state.menu_value !== 'undefined') {
      document.getElementById('menu-'+this.state.menu_value).className = 'menu_inactive_item';
    }
    if (this.state.party_value !== 'undefined') {
      document.getElementById('party-'+this.state.party_value).className = 'party_inactive_item';
    }
    if (this.state.state_value !== 'undefined'){
      document.getElementById('state-'+this.state.state_value).className = 'state_inactive_item';
    }
    if (this.state.victim_religion_value !== 'undefined') {
      document.getElementById('victim-'+this.state.victim_religion_value).className = 'victim_inactive_item';
    }
    if (this.state.accused_religion_value !== 'undefined') {
      document.getElementById('accused-'+this.state.accused_religion_value).className = 'accused_inactive_item';
    }
    if (this.state.police_to_population_value !== 'undefined') {
      document.getElementById('police-'+this.state.police_to_population_value).className = 'police_inactive_item';
    }
    if (this.state.judge_to_population_value !== 'undefined') {
      document.getElementById('judge-'+this.state.judge_to_population_value).className = 'judge_inactive_item';
    }
    if (this.state.police_prevent_death_value !== 'undefined') {
      document.getElementById('police-prevent-'+this.state.police_prevent_death_value).className = 'police_prevent_inactive_item';
    }
     if (this.state.police_intervene_value !== 'undefined') {
      document.getElementById('police-intervene-'+this.state.police_intervene_value).className = 'police_intervene_inactive_item';
    }
    if (this.state.lynching_planned_value !== 'undefined') {
      document.getElementById('lynching-'+this.state.lynching_planned_value).className = 'lynching_inactive_item';
    }
    if (this.state.criminalise_victims_value !== 'undefined') {
      document.getElementById('criminalise-'+this.state.criminalise_victims_value).className = 'criminalise_inactive_item';
    }
    if (this.state.area_classification_value !== 'undefined') {
      document.getElementById('area-'+this.state.area_classification_value).className = 'area_inactive_item';
    }
    // console.log(this.state.dataJSON, "this.state.dataJSON")
    let end_domain = new Date (this.state.dataJSON[0].date),
      start_domain = new Date (this.state.dataJSON[this.state.dataJSON.length - 1].date)
    this.setState({
      menu_value: 'undefined',
      party_value: 'undefined',
      state_value: 'undefined',
      victim_religion_value: 'undefined',
      accused_religion_value: 'undefined',
      police_to_population_value: 'undefined',
      judge_to_population_value: 'undefined',
      police_prevent_death_value: 'undefined',
      lynching_planned_value: 'undefined',
      criminalise_victims_value: 'undefined',
      area_classification_value: 'undefined',
      police_vehicles_value: 'undefined',
      village_defence_force_value: 'undefined',
      police_intervene_value: 'undefined',
      year_value: {
        min: 'undefined',
        max: 'undefined'
      },
      start_domain: start_domain,
      end_domain: end_domain
    })
  }

  highlightItem(value, inactive, active, identifier) {
    let elm = document.getElementsByClassName(inactive),
      inactiveClass = inactive,
      activeClass = active;
    let i = 0;
    // console.log(elm, inactiveClass, activeClass, "---------active-----")
    while (i < elm.length) {
      i++;
      elm[0].className = activeClass;
    }
    // console.log(document.getElementById(`${identifier}-${value}`), "id", activeClass)
    let selectItem = document.getElementById(`${identifier}-${value}`);
    selectItem.className = activeClass;
  }

  checkMenu(val, index, arr){
    if(this === 'undefined') {
      return true;
    }
    return val.classification === this;
  }

  checkParty(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.party_whose_chief_minister_is_in_power === this;
  }

  checkState(val, index, arr){
    if(this === 'undefined') {
      return true;
    }
    return val.state === this;
  }

  checkVictimReligion(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.victim_social_classification === this;
  }

  checkAccusedReligion(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.accused_social_classification === this;
  }

  checkPoliceRatio(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.police_to_population_in_state === this;
  }

  checkJudgeRatio(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.judge_to_population_in_state === this;
  }

  checkYear (val, index, arr) {
    if(this.min === 'undefined' || this.max === 'undefined') {
      return true;
    }
    let date_ref = val.date,
      new_date = date_ref.slice(0, 7);
    return new_date >= this.min && new_date <= this.max;
  }

  checkPolicePrevent(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val['did_the_police_intervention_prevent_death'] === this;
  }

  checkPoliceIntervene(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val['did_the_police_intervene'] === this;
  }

  checkLynchingPlanned(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.was_incident_planned === this;
  }

  checkCriminaliseVictims(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.does_the_state_criminalise_victims_actions === this;
  }

  checkArea(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.area_classification === this;
  }

  checkPoliceVehicles(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.police_vehicles_per_km === this;
  }

  checkVillageDefenseForce(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.does_state_have_village_defence_force === this;
  }

  getFilteredData(state) {
    let filteredData = this.state.dataJSON
      .filter(this.checkMenu, state.menu_value)
      .filter(this.checkParty, state.party_value)
      .filter(this.checkState, state.state_value)
      .filter(this.checkVictimReligion, state.victim_religion_value)
      .filter(this.checkAccusedReligion, state.accused_religion_value)
      .filter(this.checkPoliceRatio, state.police_to_population_value)
      .filter(this.checkJudgeRatio, state.judge_to_population_value)
      .filter(this.checkPolicePrevent, state.police_prevent_death_value)
      .filter(this.checkLynchingPlanned, state.lynching_planned_value)
      .filter(this.checkCriminaliseVictims, state.criminalise_victims_value)
      .filter(this.checkArea, state.area_classification_value)
      .filter(this.checkPoliceVehicles, state.police_vehicles_value)
      .filter(this.checkVillageDefenseForce, state.village_defence_force_value)
      .filter(this.checkPoliceIntervene, state.police_intervene_value)
      .filter(this.checkYear, state.year_value)
    
      // console.log(state.start_domain, "state.start_domain",filteredData[0], filteredData)
      if (filteredData[0] !== undefined){
        state.start_domain = new Date(filteredData[0].date),
        state.end_domain = new Date(filteredData[filteredData.length - 1].date)
      } else {
        state.start_domain = NaN;
        state.end_domain = NaN;
      }
      
    return filteredData;
  }

  showFilters() {
    this.setState({
      height: 880,
      overflow: 'auto',
      showTapArea: 'none',
      hideTapArea: 'block'
    })
  }

  hideFilters() {
    this.setState({
      height: 0,
      overflow: 'hidden',
      showTapArea: 'block',
      hideTapArea: 'none'
    })
  }

  showCounter() {
    setTimeout(function(){
      $('.animate-number').each(function () {
        $(this).prop('Counter',0).animate({
          Counter: $(this).text()
        },{
            duration: 2000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now));
            }
        });
      }); 
    },1000)
  }

  getDateRange(arr) {
    let new_arr = arr.sort(function (a, b) {
      let key1 = new Date(a.date),
        key2 = new Date(b.date);
      if (key1 > key2) {
        return -1;
      } else if (key1 == key2) {
        return 0;
      } else {
        return 1;
      }
    });
    // console.log(new_arr, "new_Arr")
    let startDate, endDate;
    if (new_arr.length === 0) {
      startDate = '';
      endDate = '';
    } else {
      startDate = new_arr[new_arr.length - 1].date;
      endDate = new_arr[0].date;
    }
    
    return {
      startDate: startDate,
      endDate: endDate
    }
  }


  renderLaptop() {
    if (this.state.dataJSON === undefined) {
      let color = '#F02E2E';

      let style = {
        display: '-webkit-flex',
        display: 'flex',
        WebkitFlex: '0 1 auto',
        flex: '0 1 auto',
        WebkitFlexDirection: 'column',
        flexDirection: 'column',
        WebkitFlexGrow: 1,
        flexGrow: 1,
        WebkitFlexShrink: 0,
        flexShrink: 0,
        WebkitFlexBasis: '100%',
        flexBasis: '100%',
        maxWidth: '100%',
        height: '200px',
        WebkitAlignItems: 'center',
        alignItems: 'center',
        WebkitJustifyContent: 'center',
        justifyContent: 'center'
      };
      return(
       <div style={{
          boxSizing: 'border-box',
          display: '-webkit-flex',
          display: 'flex',
          WebkitFlex: '0 1 auto',
          flex: '0 1 auto',
          WebkitFlexDirection: 'row',
          flexDirection: 'row',
          WebkitFlexWrap: 'wrap',
          flexWrap: 'wrap',
        }}>
          <div style={style}><Halogen.RiseLoader color={color}/></div>
        </div>
      )
    } else {
      let menuOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'classification')).map((d, i) => {
        return (
          <tr className='menu_inactive_item' id={`menu-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeMenu(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let partyOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'party_whose_chief_minister_is_in_power')).map((d, i) => {
        return (
          <tr className='party_inactive_item' id={`party-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeParty(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })
        
      let stateOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'state')).map((d, i) => {
        return (
          <tr className='state_inactive_item' id={`state-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeState(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })
   
      let victimReligionOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'victim_social_classification')).map((d, i) => {
        let name;
        if (d.key === ''){
          name = 'Unknown'
        } else {
          name = d.key
        }
        return (
          <tr className='victim_inactive_item' id={`victim-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeVR(e, d.key)}>{name}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let accusedReligionOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'accused_social_classification')).map((d, i) => {
        let name;
        if (d.key === ''){
          name = 'Unknown'
        } else {
          name = d.key
        }
        return (
          <tr className='accused_inactive_item' id={`accused-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeAR(e, d.key)}>{name}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let policeRatioOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'police_to_population_in_state')).map((d, i) => {
        return (
          <tr className='police_inactive_item' id={`police-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangePolice(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })
      
      let judgeRatioOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'judge_to_population_in_state')).map((d, i) => {
        return (
          <tr className='judge_inactive_item' id={`judge-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeJudge(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let policePreventOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'did_the_police_intervention_prevent_death')).map((d, i) => {
        return (
          <tr className='police_prevent_inactive_item' id={`police-prevent-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangePolicePrevent(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let policeInterveneOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'did_the_police_intervene')).map((d, i) => {
        return (
          <tr className='police_intervene_inactive_item' id={`police-intervene-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangePoliceIntervene(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })
      
      let lynchingOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'was_incident_planned')).map((d, i) => {
        return (
          <tr className='lynching_inactive_item' id={`lynching-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeLynchingPlanned(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let criminaliseOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'does_the_state_criminalise_victims_actions')).map((d, i) => {
        return (
          <tr className='criminalise_inactive_item' id={`criminalise-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeCriminaliseVictims(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })
      
      let areaOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'area_classification')).map((d, i) => {
        return (
          <tr className='area_inactive_item' id={`area-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeArea(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let policeVehiclesOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'police_vehicles_per_km')).map((d, i) => {
        return (
          <tr className='police_vehicles_inactive_item' id={`police-vehicles-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangePoliceVehicles(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let defenseForceOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'does_state_have_village_defence_force')).map((d, i) => {
        return (
          <tr className='defence_force_inactive_item' id={`defence-force-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnChangeVillageDefenseForce(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      // console.log(this.state.filteredJSON,this.state.filteredJSON.length, "-----------" )

      let number_of_incidents = this.state.filteredJSON.length,
        range = this.state.filteredJSON,
        number_of_digits = number_of_incidents.toString().length,
        length = range.length - 1,
        start_date, end_date;

      if (range.length === 0) {
        start_date = '';
        end_date = '';
      } else {
        let formated_start_date = Utils.formatDate(range[length].date);
        start_date = range[length].date.split("-")[2] + " " +formated_start_date.split(" ")[0].substring(0, 3) + " '" + formated_start_date.split(" ")[1].substring(3, 5)
        let formated_end_date = Utils.formatDate(range[0].date)
        end_date = range[0].date.split("-")[2] + " " +formated_end_date.split(" ")[0].substring(0, 3) + " '" + formated_end_date.split(" ")[1].substring(3, 5) ;
      }

      let styles = {
        height: this.state.height,
        overflow: this.state.overflow,
        transition: 'ease-in 0.3s'
      };
      let first_tap_area_style = {
        display: this.state.showTapArea
      },
      second_tap_area_style = {
        display: this.state.hideTapArea
      }

      $('#planned-incident-help').popup({
        position : 'bottom center',
       html: '"Planned" if it was clearly planned against a specific victim. Example - a village meeting that decides that someone needs to be lynched. "Neighbourhood watch" where local citizens were on the lookout for potential "wrong-doers" and the victim was targeted incidentally. ( Cow vigilante groups, neighbourhood watch for thieves etc). "Spontaneous" if the incident was triggered with no prior planning and occurred as an immediate, spontaneous response to the victims actions. "Not clear" if nothing is mentioned in the article.'
      })

      $('#judge-help').popup({
        position : 'bottom center',
        html: 'Judge to population ratio in the state. From Court News, publication of the Supreme Court, Vol XI Issue No. 1 Jan - Mar 2016.'
      })

      $('#police-help').popup({
        position : 'bottom center',
        html: 'Police to population ratio in the state. Data compiled by Bureau of Police Research and Development as on Jan 2016. The UN recommended police to population ratio is 230.'
      })

      $('#police-vehicles-help').popup({
        position : 'bottom center',
        html: 'Number of police vehicles per square kilometres in the state. Data compiled by Bureau of Police Research and Development as on Jan 2016.'
      })

      $('#police-intervene-help').popup({
        position : 'bottom center',
        html: 'Interpreted from article'
      })

      $('#police-prevent-help').popup({
        position : 'bottom center',
        html: 'Interpreted from article'
      })

      $('#defence-help').popup({
        position : 'bottom center',
        html: 'Based on what we could find from Google Searches. We found some version of Village Defence Forces or a government organised Neighbourhood Watch like organisations.'
      })

      $('#victim-help').popup({
        position : 'bottom center',
        html: 'Either mentioned in the article or interpreted from article'
      })

      $('#accused-help').popup({
        position : 'bottom center',
        html: 'Either mentioned in the article or interpreted from article'
      }) 

      return (
        <div className="banner-area">
          <div className="filter-area">
            <div className="tap-area" style={first_tap_area_style} onClick={(e) => this.showFilters(e)}>
              <span className="arrow-down"></span><div id="tap-me">Tap here to explore data</div><span className="arrow-down"></span>
            </div>
            <div id="filter-region" className="ui grid" style={styles}>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">What led to the violence?
                    </th></tr>
                  </thead>
                  <tbody>{menuOptions}</tbody>
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Was the incident planned?
                      <div id="planned-incident-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{lynchingOptions}</tbody>                 
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">State</th></tr>                    
                  </thead>
                  <tbody className="table-tbody">{stateOptions}</tbody>
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Party whose Chief Minister was in power
                    </th></tr>
                  </thead>
                  <tbody className="table-tbody">{partyOptions}</tbody>
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Area type</th></tr>                   
                  </thead>
                  <tbody>{areaOptions}</tbody>
               </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Judge to population ratio
                      <div id="judge-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{judgeRatioOptions}</tbody>                  
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Police to population ratio
                      <div id="police-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{policeRatioOptions}</tbody>
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Police vehicles per sq. km
                      <div id="police-vehicles-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody className="table-tbody">{policeVehiclesOptions}</tbody>                
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Did the police intervene?
                      <div id="police-intervene-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{policeInterveneOptions}</tbody>
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Did the police intervention prevent death?
                      <div id="police-prevent-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{policePreventOptions}</tbody>
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Does state have village defence force?
                      <div id="defence-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{defenseForceOptions}</tbody>                  
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Victim social classification
                      <div id="victim-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody className="table-tbody">{victimReligionOptions}</tbody>                  
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Accused social classification
                      <div id="accused-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody className="table-tbody">{accusedReligionOptions}</tbody>
                </table>
              </div>
            </div>
            <div className="tap-area" style={second_tap_area_style} onClick={(e) => this.hideFilters(e)}>
              <div className="tap-area-div">
                <span className="arrow-up"></span><div id="tap-me">Tap here to hide filters</div><span className="arrow-up"></span>
              </div>
              <button className="ui secondary button reset-all" onClick={(e) => this.handleReset(e)}>Reset</button>
            </div>
          </div>
          <div className="ui grid">
            <div className="six wide column filter-title">
              <div className="count-area">
                <div className="number-background">
                  <div className="single-background"></div>
                  <div className="single-background"></div>
                  <div className="single-background"></div>
                </div>
                <div className="display-number">
                  {number_of_digits !== 3 ? <span className="light-text">0</span>:'' }
                  {number_of_digits === 1 ? <span className="light-text">0</span>:'' }
                  <span className="animate-number">{number_of_incidents}</span>
                </div>
              </div>
              <div className="display-text">Instances of lynching were reported <br/>
               {start_date === '' || end_date === '' ? '' : `from ${start_date} to ${end_date}` }
              </div>
              <TimeBrush dataJSON={this.state.filteredJSON} dimensionWidth={this.props.dimensionWidth} start_domain={this.state.start_domain} end_domain={this.state.end_domain} mode={this.props.mode} handleSelectDateRange={this.handleSelectDateRange}/>
            </div>
            <div className="ten wide column filter-title">
              <Map dataJSON={this.state.filteredJSON} topoJSON={this.state.topoJSON} chartOptions={this.props.chartOptions} mode={this.props.mode} circleClicked={this.state.circleClicked} handleCircleClicked={this.handleCircleClicked} circleHover={this.state.circleHover}/>
            </div>
          </div>
          <div className="sixteen wide column">
            <div className="protograph-container">
              <List dataJSON={this.state.filteredJSON} mode={this.props.mode} handleCircleClicked={this.handleCircleClicked}/>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'laptop' :
        return this.renderLaptop();
      case 'mobile' :
        return this.renderLaptop();
    }
  }
}

export default App;