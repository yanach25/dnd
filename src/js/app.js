import List from './list';
import Card from './card';
import Renderer from './renderer';

class App {
  constructor() {
    this.lists = [];
    this.registerListeners();
  }

  init() {
    const storage = localStorage.getItem('lists');

    if (storage) {
      this.load(storage);
    } else {
      this.lists = ['todo', 'in progress', 'done'].map((item) => new List(item));
      this.save();
    }
    Renderer.renderInitial(this.lists);
  }

  registerListeners() {
    this.watchDnD();
    this.watchClick();
  }

  watchDnD() {
    document.addEventListener('mousedown', (event) => {
      const isDraggable = Renderer.isDraggable(event.target);
      if (isDraggable) {
        this.draggedEl = event.target;
        this.ghostEl = Renderer.cloneNode(event.target, true);
        const { x, y, width } = Renderer.getBoundingClientRect(event.target);

        this.ghostEl.style.width = `${width - 40}px`;
        this.ghostEl.classList.add('dragging');
        this.ghostEl.style.boxShadow = 'none';
        this.ghostEl.style.padding = '10px';

        const ghostBnt = this.ghostEl.querySelector('a');
        ghostBnt.remove();

        Renderer.appendChild(document.body, this.ghostEl);
        this.draggedEl.classList.add('hidden');
        this.offsetX = event.pageX - x - 10;
        this.offsetY = event.pageY - y - 10;
        this.ghostEl.style.position = 'absolute';
        this.ghostEl.style.top = `${event.pageY - this.offsetY}px`;
        this.ghostEl.style.left = `${event.pageX - this.offsetX}px`;
      }
    });

    document.addEventListener('mousemove', (event) => {
      const elementFromPoint = Renderer.getElementFromPoint(event);
      if (this.ghostEl) {
        this.ghostEl.style.top = `${event.pageY - this.offsetY}px`;
        this.ghostEl.style.left = `${event.pageX - this.offsetX}px`;

        if (elementFromPoint?.classList.contains('shadow')) {
          return;
        }

        const shadow = document.querySelector('.shadow');
        const isDraggable = Renderer.isDraggable(elementFromPoint);

        if ((!isDraggable && shadow)
          || (isDraggable && shadow && elementFromPoint.nextElementSibling !== shadow)) {
          shadow.remove();
        }

        if (isDraggable && elementFromPoint.nextElementSibling === shadow) {
          return;
        }

        const shadowEl = Renderer.cloneNode(this.draggedEl);
        shadowEl.classList.remove('hidden');
        shadowEl.classList.add('shadow');

        if (isDraggable) {
          elementFromPoint?.parentNode?.insertBefore(shadowEl, elementFromPoint.nextElementSibling);
        } else {
          const container = elementFromPoint?.closest('.container');
          const wrapper = container?.querySelector('.list-content');
          wrapper?.appendChild(shadowEl);
        }
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.ghostEl) {
        const shadowEl = document.querySelector('.shadow');
        document.body.removeChild(this.ghostEl);

        if (shadowEl) {
          const fromListId = this.draggedEl.closest('.list-wrapper').dataset.id;
          const toListId = shadowEl.closest('.list-wrapper').dataset.id;
          const cardId = this.draggedEl.dataset.id;
          const fromList = this.lists.find((item) => item.id === fromListId);
          const els = shadowEl.parentNode.querySelectorAll('.card');
          const index = Array.from(els).findIndex((item) => item === shadowEl);
          const card = fromList.cards.find((item) => item.id === cardId);
          fromList.removeCard(cardId);
          const toList = this.lists.find((item) => item.id === toListId);
          toList.setCardToPosition(card, index);
          this.save();

          this.draggedEl.remove();
          shadowEl.classList.remove('shadow');
        } else {
          this.ghostEl.remove();
          this.draggedEl.classList.remove('hidden');
        }

        this.ghostEl = null;
        this.draggedEl = null;
      }
    });
  }

  watchClick() {
    let form;
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const listWrapper = Renderer.getClosest(event.target, '.list-wrapper');
      if (listWrapper?.dataset?.id) {
        const listId = listWrapper.dataset.id;

        switch (event.target.dataset.type) {
          case 'showAddNew':
            App.showEditable(listWrapper);
            break;
          case 'cancelAddNew':
            App.hideEditable(listWrapper);
            form = Renderer.getClosest(event.target, 'form');
            form.reset();
            break;
          case 'addNew':
            form = Renderer.getClosest(event.target, 'form');
            const formData = new FormData(form);
            const content = formData.get('textarea');
            if (content) {
              const card = new Card(content);
              const contentEl = Renderer.getContentContainer(listId);
              Renderer.appendCard(contentEl, card);
              form.reset();
              const list = this.lists.find((item) => item.id === listId);
              list.addCard(card);
              this.save();
            }
            break;
          case 'removeCard':
            const card = Renderer.getClosest(event.target, '.card');
            const list = this.lists.find((item) => item.id === listId);
            list.removeCard(card.dataset.id);
            this.save();
            card.remove();
            break;
          default:
            break;
        }
      }
    });
  }

  load(storage) {
    try {
      const lists = JSON.parse(storage);

      this.lists = lists.map((item) => {
        const cards = item.cards.map((card) => new Card(card.content, card.id));

        return new List(item.name, cards, item.id);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  save() {
    localStorage.setItem('lists', JSON.stringify(this.lists));
  }

  static showEditable(el) {
    Renderer.hide(el, 'list-footer-button');
    Renderer.show(el, 'list-footer-edit');
  }

  static hideEditable(el) {
    Renderer.show(el, 'list-footer-button');
    Renderer.hide(el, 'list-footer-edit');
  }
}

const app = new App();

app.init();
