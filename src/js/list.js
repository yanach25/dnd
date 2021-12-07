import { v4 } from 'uuid';

export default class List {
  constructor(name, cards = [], id = null) {
    this.name = name;
    this.id = id ?? v4();
    this.cards = cards;
  }

  addCard(card) {
    this.cards.push(card);
  }

  setCardToPosition(card, index) {
    this.cards.splice(index, 0, card);
  }

  addCards(cards) {
    this.cards = [...this.cards, ...cards];
  }

  removeCard(id) {
    const card = this.cards.find((currentCard) => currentCard.id === id);
    this.cards = this.cards.filter((item) => item !== card);
  }
}
