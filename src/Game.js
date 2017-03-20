import React, {Component} from 'react';
import Card from './Card';
import Player from './Player';
import './Game.css';

export default class Game extends Component {
  constructor(props) {
    super(props);   
    this.checkMatch = this.checkMatch.bind(this);  

    this.state = { 
      locked: false, 
      cards: [], 
      players: [] 
    };     
  }

  componentWillReceiveProps(nextProps) {       
    this.setState({ 
      cards: nextProps.cards, 
      players: nextProps.players 
    }); 
  }    
 
  checkMatch(card) {

    if (this.state.locked) return;
    this.setState({ locked: true });   
    
    var byid = id => card => card.id === id;
    var isFlipped = card => card.flipped === true;         

    var cards = Object.assign([], this.state.cards);
    var players = Object.assign([], this.state.players);  

    cards.find(byid(card.id)).flipped = true; 
    var flippedCards = cards.filter(isFlipped);       

    if (flippedCards.length === 2) {      
      setTimeout(() => {
        if (flippedCards[0].value === flippedCards[1].value) {        
          cards.filter(isFlipped).forEach(c => c.matched = true, c.flipped = false);
          players[0].matched += 1;
          this.setState({cards, players});
        } else {        
          cards.filter(isFlipped).forEach(c => c.flipped = false);
          players.push(players.shift());                     
          this.setState({cards, players});
        }
      }, 1000);
    } 

    this.setState({ locked: false });    
  }

  render() {  
    if (this.props.visible) {
      return (
        <div className='Game'>  
          <div className='Players'>      
            { this.state.players.map((player, index) => { return ( 
              <Player key={index} id={index} player={player} current={index===0} /> 
            );})}
          </div><div className='Cards'>  
            { this.state.cards.map((card, index) => { return (
              <Card key={index} id={index} card={card} checkMatch={this.checkMatch} />
            );})}
          </div>
        </div>
      );      
    }

    return null;
  }
}