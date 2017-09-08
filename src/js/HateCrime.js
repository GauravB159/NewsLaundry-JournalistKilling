import React from 'react';
import axios from 'axios';
import Halogen from 'halogen';
import List from '../js/List';
import Map from '../js/Map';
import TimeBrush from '../js/TimeBrush';
import Utils from '../js/Utils';
import {timeFormat} from 'd3-time-format';

class HateCrime extends React.Component {
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
      party: [],
      lynching_planned: [],
      criminalise_victims: [], 
      area_classification: [], 
      is_hate_crime:[],
      is_gender_hate_crime: [],
      is_caste_hate_crime: [],
      is_race_hate_crime: [],
      is_religion_hate_crime: [],
      is_political_hate_crime: [],
      is_sexual_hate_crime: [],
      is_disability_hate_crime: [],
      is_ethnicity_hate_crime: [],
      menu_value: 'undefined',
      party_value: 'undefined',
      state_value: 'undefined',
      victim_religion_value: 'undefined',
      accused_religion_value: 'undefined',
      lynching_planned_value: 'undefined',
      criminalise_victims_value: 'undefined',
      area_classification_value: 'undefined',
      is_hate_crime_value:'undefined',
      is_gender_hate_crime_value: 'undefined',
      is_caste_hate_crime_value: 'undefined',
      is_race_hate_crime_value: 'undefined',
      is_religion_hate_crime_value: 'undefined',
      is_political_hate_crime_value: 'undefined',
      is_sexual_hate_crime_value: 'undefined',
      is_disability_hate_crime_value: 'undefined',
      is_ethnicity_hate_crime_value: 'undefined',
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
          lynching_planned = this.sortObject(Utils.groupBy(this.state.dataJSON, 'was_incident_planned')),
          criminalise_victims = this.sortObject(Utils.groupBy(this.state.dataJSON, 'does_the_state_criminalise_victims_actions')),
          area_classification = this.sortObject(Utils.groupBy(this.state.dataJSON, 'area_classification')),
          is_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_hate_crime')),
          is_gender_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_gender_hate_crime')),
          is_caste_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_caste_hate_crime')),
          is_race_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_race_hate_crime')),
          is_religion_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_religion_hate_crime')),
          is_political_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_political_affiliation_hate_crime')),
          is_sexual_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_sexual_orientation_and_gender_identity_hate_crime')),
          is_disability_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_disability_hate_crime')),
          is_ethnicity_hate_crime = this.sortObject(Utils.groupBy(this.state.dataJSON, 'is_ethnicity_hate_crime'));

        this.setState({
          menu: menu,
          party: party,
          state: state,
          victim_religion: victim_religion,
          accused_religion: accused_religion,
          lynching_planned: lynching_planned,
          criminalise_victims: criminalise_victims,
          area_classification: area_classification,
          is_hate_crime: is_hate_crime,
          is_gender_hate_crime: is_gender_hate_crime,
          is_caste_hate_crime: is_caste_hate_crime,
          is_race_hate_crime: is_race_hate_crime,
          is_religion_hate_crime: is_religion_hate_crime,
          is_political_hate_crime: is_political_hate_crime,
          is_sexual_hate_crime: is_sexual_hate_crime,
          is_disability_hate_crime: is_disability_hate_crime,
          is_ethnicity_hate_crime: is_ethnicity_hate_crime
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

  handleOnChangeCriminaliseVictims(e, value){
    this.setState((prevState, props) => {
      if (prevState.criminalise_victims_value !== value || prevState.criminalise_victims_value === 'undefined') {
        prevState.criminalise_victims_value = value;
        this.highlightItem(value, 'criminalise_inactive_item','criminalise_active_item', 'criminalise');
      } else {
        prevState.criminalise_victims_value = 'undefined';
        this.highlightItem(value, 'criminalise_inactive_item','criminalise_inactive_item', 'criminalise');
      }
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        criminalise_victims_value: prevState.criminalise_victims_value
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

  handleOnIsHateCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_hate_crime_value !== value || prevState.is_hate_crime_value === 'undefined') {
        prevState.is_hate_crime_value = value;
        this.highlightItem(value, 'hate_inactive_item','hate_active_item', 'hate');
      } else {
        prevState.is_hate_crime_value = 'undefined';
        this.highlightItem(value, 'hate_inactive_item','hate_inactive_item', 'hate');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_hate_crime_value: prevState.is_hate_crime_value
      }
    })
  }

  handleOnIsGenderCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_gender_hate_crime_value !== value || prevState.is_gender_hate_crime_value === 'undefined') {
        prevState.is_gender_hate_crime_value = value;
        this.highlightItem(value, 'gender_inactive_item','gender_active_item', 'gender');
      } else {
        prevState.is_gender_hate_crime_value = 'undefined';
        this.highlightItem(value, 'gender_inactive_item','gender_inactive_item', 'gender');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_gender_hate_crime_value: prevState.is_gender_hate_crime_value
      }
    })
  }

  handleOnIsCasteCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_caste_hate_crime_value !== value || prevState.is_caste_hate_crime_value === 'undefined') {
        prevState.is_caste_hate_crime_value = value;
        this.highlightItem(value, 'caste_inactive_item','caste_active_item', 'caste');
      } else {
        prevState.is_caste_hate_crime_value = 'undefined';
        this.highlightItem(value, 'caste_inactive_item','caste_inactive_item', 'caste');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_caste_hate_crime_value: prevState.is_caste_hate_crime_value
      }
    })
  }

  handleOnIsRaceCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_race_hate_crime_value !== value || prevState.is_race_hate_crime_value === 'undefined') {
        prevState.is_race_hate_crime_value = value;
        this.highlightItem(value, 'race_inactive_item','race_active_item', 'race');
      } else {
        prevState.is_race_hate_crime_value = 'undefined';
        this.highlightItem(value, 'race_inactive_item','race_inactive_item', 'race');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_race_hate_crime_value: prevState.is_race_hate_crime_value
      }
    })
  }

  handleOnIsReligionCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_religion_hate_crime_value !== value || prevState.is_religion_hate_crime_value === 'undefined') {
        prevState.is_religion_hate_crime_value = value;
        this.highlightItem(value, 'religion_inactive_item','religion_active_item', 'religion');
      } else {
        prevState.is_religion_hate_crime_value = 'undefined';
        this.highlightItem(value, 'religion_inactive_item','religion_inactive_item', 'religion');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_religion_hate_crime_value: prevState.is_religion_hate_crime_value
      }
    })
  }

  handleOnIsPoliticalCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_political_hate_crime_value !== value || prevState.is_political_hate_crime_value === 'undefined') {
        prevState.is_political_hate_crime_value = value;
        this.highlightItem(value, 'political_inactive_item','political_active_item', 'political');
      } else {
        prevState.is_political_hate_crime_value = 'undefined';
        this.highlightItem(value, 'political_inactive_item','political_inactive_item', 'political');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_political_hate_crime_value: prevState.is_political_hate_crime_value
      }
    })
  }

  handleOnIsSexualCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_sexual_hate_crime_value !== value || prevState.is_sexual_hate_crime_value === 'undefined') {
        prevState.is_sexual_hate_crime_value = value;
        this.highlightItem(value, 'sexual_inactive_item','sexual_active_item', 'sexual');
      } else {
        prevState.is_sexual_hate_crime_value = 'undefined';
        this.highlightItem(value, 'sexual_inactive_item','sexual_inactive_item', 'sexual');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_sexual_hate_crime_value: prevState.is_sexual_hate_crime_value
      }
    })
  }

  handleOnIsDisabilityCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_disability_hate_crime_value !== value || prevState.is_disability_hate_crime_value === 'undefined') {
        prevState.is_disability_hate_crime_value = value;
        this.highlightItem(value, 'disability_inactive_item','disability_active_item', 'disability');
      } else {
        prevState.is_disability_hate_crime_value = 'undefined';
        this.highlightItem(value, 'disability_inactive_item','disability_inactive_item', 'disability');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_disability_hate_crime_value: prevState.is_disability_hate_crime_value
      }
    })
  }

  handleOnIsEthnicityCrime(e, value) {
    this.setState((prevState, props) => {
      if (prevState.is_ethnicity_hate_crime_value !== value || prevState.is_ethnicity_hate_crime_value === 'undefined') {
        prevState.is_ethnicity_hate_crime_value = value;
        this.highlightItem(value, 'ethnicity_inactive_item','ethnicity_active_item', 'ethnicity');
      } else {
        prevState.is_ethnicity_hate_crime_value = 'undefined';
        this.highlightItem(value, 'ethnicity_inactive_item','ethnicity_inactive_item', 'ethnicity');
      }    
      let filteredData = this.getFilteredData(prevState)
      return {
        filteredJSON: filteredData,
        is_ethnicity_hate_crime_value: prevState.is_ethnicity_hate_crime_value
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
    if (this.state.lynching_planned_value !== 'undefined') {
      document.getElementById('lynching-'+this.state.lynching_planned_value).className = 'lynching_inactive_item';
    }
    if (this.state.criminalise_victims_value !== 'undefined') {
      document.getElementById('criminalise-'+this.state.criminalise_victims_value).className = 'criminalise_inactive_item';
    }
    if (this.state.area_classification_value !== 'undefined') {
      document.getElementById('area-'+this.state.area_classification_value).className = 'area_inactive_item';
    }
    if (this.state.is_hate_crime_value !== 'undefined') {
      document.getElementById('hate-'+this.state.is_hate_crime_value).className = 'hate_inactive_item';
    }
    if (this.state.is_gender_hate_crime_value !== 'undefined') {
      document.getElementById('gender-'+this.state.is_gender_hate_crime_value).className = 'gender_inactive_item';
    }
    if (this.state.is_caste_hate_crime_value !== 'undefined') {
      document.getElementById('caste-'+this.state.is_caste_hate_crime_value).className = 'caste_inactive_item';
    }
    if (this.state.is_race_hate_crime_value !== 'undefined') {
      document.getElementById('race-'+this.state.is_race_hate_crime_value).className = 'caste_inactive_item';
    }
    if (this.state.is_religion_hate_crime_value !== 'undefined') {
      document.getElementById('religion-'+this.state.is_religion_hate_crime_value).className = 'religion_inactive_item';
    }
    if (this.state.is_political_hate_crime_value !== 'undefined') {
      document.getElementById('political-'+this.state.is_political_hate_crime_value).className = 'political_inactive_item';
    }
    if (this.state.is_sexual_hate_crime_value !== 'undefined') {
      document.getElementById('sexual-'+this.state.is_sexual_hate_crime_value).className = 'sexual_inactive_item';
    }
    if (this.state.is_disability_hate_crime_value !== 'undefined') {
      document.getElementById('disability-'+this.state.is_disability_hate_crime_value).className = 'disability_inactive_item';
    }
    if (this.state.is_ethnicity_hate_crime_value !== 'undefined') {
      document.getElementById('ethnicity-'+this.state.is_ethnicity_hate_crime_value).className = 'ethnicity_inactive_item';
    }
    let end_domain = new Date (this.state.dataJSON[0].date),
      start_domain = new Date (this.state.dataJSON[this.state.dataJSON.length - 1].date)
    this.setState({
      menu_value: 'undefined',
      party_value: 'undefined',
      state_value: 'undefined',
      victim_religion_value: 'undefined',
      accused_religion_value: 'undefined',
      lynching_planned_value: 'undefined',
      criminalise_victims_value: 'undefined',
      area_classification_value: 'undefined',
      is_hate_crime_value:'undefined',
      is_gender_hate_crime_value: 'undefined',
      is_caste_hate_crime_value: 'undefined',
      is_race_hate_crime_value: 'undefined',
      is_religion_hate_crime_value: 'undefined',
      is_political_hate_crime_value: 'undefined',
      is_sexual_hate_crime_value: 'undefined',
      is_disability_hate_crime_value: 'undefined',
      is_ethnicity_hate_crime_value: 'undefined',
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
    while (i < elm.length) {
      i++;
      elm[0].className = activeClass;
    }
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

  checkYear (val, index, arr) {
    if(this.min === 'undefined' || this.max === 'undefined') {
      return true;
    }
    let new_date = val.date.slice(0, 7)
    // console.log(new_date, "new_date")
    return new_date >= this.min && new_date <= this.max;
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

  checkIsHateCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_hate_crime === this;
  }

  checkIsGenderCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_gender_hate_crime === this; 
  } 

  checkIsCasteCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_caste_hate_crime === this;
  }

  checkIsRaceCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_race_hate_crime === this
  }

  checkIsReligionCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_religion_hate_crime === this
  }

  checkIsPoliticalCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_political_affiliation_hate_crime === this
  }

  checkIsSexualCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_sexual_orientation_and_gender_identity_hate_crime === this
  }

  checkIsDisabilityCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_disability_hate_crime === this
  }

  checkIsEthnicityCrime(val, index, arr) {
    if(this === 'undefined') {
      return true;
    }
    return val.is_ethnicity_hate_crime === this
  }

  getFilteredData(state) {
    // console.log(state, state.menu_value, "-----------", this.state.dataJSON)
    let filteredData = this.state.dataJSON
      .filter(this.checkMenu, state.menu_value)
      .filter(this.checkParty, state.party_value)
      .filter(this.checkState, state.state_value)
      .filter(this.checkVictimReligion, state.victim_religion_value)
      .filter(this.checkAccusedReligion, state.accused_religion_value)
      .filter(this.checkLynchingPlanned, state.lynching_planned_value)
      .filter(this.checkArea, state.area_classification_value)
      .filter(this.checkIsHateCrime, state.is_hate_crime_value )
      .filter(this.checkIsGenderCrime, state.is_gender_hate_crime_value)
      .filter(this.checkIsCasteCrime, state.is_caste_hate_crime_value)
      .filter(this.checkIsRaceCrime, state.is_race_hate_crime_value)
      .filter(this.checkIsReligionCrime, state.is_religion_hate_crime_value)
      .filter(this.checkIsPoliticalCrime, state.is_political_hate_crime_value )
      .filter(this.checkIsSexualCrime, state.is_sexual_hate_crime_value )
      .filter(this.checkIsDisabilityCrime, state.is_disability_hate_crime_value)
      .filter(this.checkIsEthnicityCrime, state.is_ethnicity_hate_crime_value)
      .filter(this.checkYear, state.year_value)
    
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
      height: 900,
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

      let hateCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_hate_crime')).map((d, i) => {
        return (
          <tr className='hate_inactive_item' id={`hate-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsHateCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let genderCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_gender_hate_crime')).map((d, i) => {
        return (
          <tr className='gender_inactive_item' id={`gender-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsGenderCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let casteCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_caste_hate_crime')).map((d, i) => {
        return (
          <tr className='caste_inactive_item' id={`caste-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsCasteCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let raceCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_race_hate_crime')).map((d, i) => {
        return (
          <tr className='race_inactive_item' id={`race-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsRaceCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let religionCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_religion_hate_crime')).map((d, i) => {
        return (
          <tr className='religion_inactive_item' id={`religion-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsReligionCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let politicalCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_political_affiliation_hate_crime')).map((d, i) => {
        return (
          <tr className='political_inactive_item' id={`political-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsPoliticalCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let sexualCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_sexual_orientation_and_gender_identity_hate_crime')).map((d, i) => {
        return (
          <tr className='sexual_inactive_item' id={`sexual-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsSexualCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let disabilityCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_disability_hate_crime')).map((d, i) => {
        return (
          <tr className='disability_inactive_item' id={`disability-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsDisabilityCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })

      let ethnicityCrimeOptions = this.sortObject(Utils.groupBy(this.state.filteredJSON, 'is_ethnicity_hate_crime')).map((d, i) => {
        return (
          <tr className='ethnicity_inactive_item' id={`ethnicity-${d.key}`}>
            <td id={d.key} key={i} value={d.key} onClick={(e) => this.handleOnIsEthnicityCrime(e, d.key)}>{d.key}</td>
            <td>{d.value}</td>
          </tr>
        )
      })
      
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
      $('#hate-help').popup({
        position : 'bottom center',
        html: 'Yes, if any of the hate crime categories are yes.'
      })

      $('#gender-help').popup({
        position : 'bottom center',
        html: 'Cases of witchcraft (in case of women), "social deviance", where it is evident that the victim was attacked because of being a woman/ transgender. If they were attacked not for their sex, but the nature of attack was gendered, example, sexual harassment, rape threats.'
      })

      $('#caste-help').popup({
        position : 'bottom center',
        html: 'Yes, if someone is attacked because they belong to a different caste, for certain caste specific practices, for inter-caste marriage and relationships, for transgressing caste boundaries, for caste based derogatory remarks.'
      })

      $('#race-help').popup({
        position : 'bottom center',
        html: 'Yes, if someone is attacked because they belong/perceived to belong to a different racial group i.e. have distinct biological and physical traits / features / appearances. Example: Attacks on people from the North-eastern part of India, on people from African nationals.'
      })

      $('#religion-help').popup({
        position : 'bottom center',
        html: 'Yes, if attacked for practicing/not practicing a certain religious faith, for hurting religious sentiments, for a particular religious practice, inter-religious marriage/relationship.'
      })

      $('#political-help').popup({
        position : 'bottom center',
        html: 'Yes, if someone is attacked because they belong to a different political party, or ideology, have criticized a certain political viewpoint, are trying to convert people politically etc.'
      })

      $('#sexual-help').popup({
        position : 'bottom center',
        html: 'Yes, if someone is attacked merely because they are homosexual / bisexual / asexual and / or for their gender identity/expression. For example,for cross dressing, for identifying with a gender that is different from their biological sex'
      })

      $('#disability-help').popup({
        position : 'bottom center',
        html: 'Yes, if someone with physical and/or mental disability is attacked (especially cases of Suspicions of witchcraft, Child lifting etc)'
      })

      $('#ethnicity-help').popup({
        position : 'bottom center',
        html: 'Yes, if someone is attacked because they belong to a different social or cultural group, speak a different dialect or language, trace their ancestry to a different lineage, come from a different tribe, or from a different region etc.'
      })

      $('#planned-incident-help').popup({
        position : 'bottom center',
        html: '"Planned" if it was clearly planned against a specific victim. Example - a village meeting that decides that someone needs to be lynched. "Neighbourhood watch" where local citizens were on the lookout for potential "wrong-doers" and the victim was targeted incidentally. ( Cow vigilante groups, neighbourhood watch for thieves etc). "Spontaneous" if the incident was triggered with no prior planning and occurred as an immediate, spontaneous response to the victims actions. "Not clear" if nothing is mentioned in the article.'
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
                    <tr><th className="table-head">Is it a hate crime?
                      <div id="hate-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{hateCrimeOptions}</tbody>               
                 </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a gender hate crime?
                      <div id="gender-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{genderCrimeOptions}</tbody>                
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a caste hate crime?
                      <div id="caste-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{casteCrimeOptions}</tbody>                
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a race hate crime?
                      <div id="race-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{raceCrimeOptions}</tbody>               
                 </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a religion hate crime?
                      <div id="religion-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{religionCrimeOptions}</tbody>                
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a political affiliation hate crime?
                      <div id="political-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{politicalCrimeOptions}</tbody>                
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a sexual orientation and gender identity hate crime?
                      <div id="sexual-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{sexualCrimeOptions}</tbody>                 
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a disability hate crime?
                      <div id="disability-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{disabilityCrimeOptions}</tbody>                 
                </table>
              </div>
              <div className="four wide column filter-title">
                <table>
                  <thead className="table-thead">
                    <tr><th className="table-head">Is it a ethnicity hate crime?
                      <div id="ethnicity-help" className="ui filter-help-text"><i className="help circle icon"></i></div>
                    </th></tr>
                  </thead>
                  <tbody>{ethnicityCrimeOptions}</tbody>                 
                </table>
              </div>
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
                    <tr><th className="table-head">State
                    </th></tr>
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
                    <tr><th className="table-head">Area type
                    </th></tr>
                  </thead>
                  <tbody>{areaOptions}</tbody>                  
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
              <div className="display-text">Instances of lynching were reported 
                {this.state.category === null ? <br/> : <div>under <span className="display-text-dropdown">{this.state.category}</span></div>}
               {start_date === '' || end_date === '' ? '' : `from ${start_date} to ${end_date}` } 
              </div>
              <TimeBrush dataJSON={this.state.filteredJSON} dimensionWidth={this.props.dimensionWidth} mode={this.props.mode} start_domain={this.state.start_domain} end_domain={this.state.end_domain} handleSelectDateRange={this.handleSelectDateRange}/>
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

export default HateCrime;