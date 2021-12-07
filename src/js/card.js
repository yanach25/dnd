import { v4 } from 'uuid';

export default class Card {
  constructor(content, id = null) {
    this.content = content;
    this.id = id ?? v4();
  }
}
