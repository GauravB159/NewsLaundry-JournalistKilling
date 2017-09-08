import React from 'react';
import Modal from '../js/Modal';
import Utils from '../js/Utils';

class ListCards extends React.Component {
  constructor () {
    super();   
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }

  handleOpenModal(e, card){
    let props = this.props; 
    $('.ui.modal').modal({
      onShow: function() {
        $("#proto-modal").css("height", 0)
      },
      onHide: function(){
        if (props.mode === 'laptop') {
          $("#proto-modal").css("height", "100%")
        }
      },
      onHidden: function(e) {
        let element = document.querySelector("#proto-embed-card iframe");
        element.parentNode.removeChild(element);
        props.handleCircleClicked(false);       
      }
    }).modal('attach events', '.close').modal('show')
    if (this.props.mode === 'laptop') {
      let pro = new ProtoEmbed.initFrame('proto-embed-card', card.iframe_url, "laptop")
    } else {
      let pro = new ProtoEmbed.initFrame('proto-embed-card', card.iframe_url, "mobile")
    }    
  }

  render() {
    if (this.props.dataJSON.length === 0) {
      return(<h2>No cards to show</h2>)
    } else {
      let cards = this.props.dataJSON.map((card, i) => {
        let x = Utils.formatDate(card.date)
        return(
          <div key={i} className="protograph-card" onClick={(e) => this.handleOpenModal(e, card)}>
            {card.image ? <img className="card-image" src={card.image} width='100%'/> : <img className="card-image" src={card.screen_shot_url} width='100%'/>}
            <div className="protograph-gradient">
              <div className="data-card-content">
                <div className="data-card-title">{card.title}</div>
                <div className="data-card-date">{card.date.split("-")[2]} {x.split(" ")[0].substring(0, 3)} '{x.split(" ")[1].substring(3, 5)} | {card.state.substring(0, 13)}</div>
              </div>
            </div>
          </div>
        )
      })
      return (
        <div>
          <div className="protograph-card-area">{cards}</div>
          <Modal handleCircleClicked={this.props.handleCircleClicked} mode={this.props.mode}/>
        </div>
      )
    }
  }
}

export default ListCards;