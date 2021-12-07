export default class Renderer {
  static renderInitial(lists) {
    const app = document.querySelector('#app');
    lists.forEach((list) => {
      app.appendChild(Renderer.renderList(list));
    });
  }

  static renderList(list) {
    const containerEl = document.createElement('div');
    containerEl.classList.add('container');

    const listEl = document.createElement('div');
    listEl.dataset.id = list.id;
    listEl.classList.add('list-wrapper');

    const headerEl = document.createElement('div');
    headerEl.classList.add('list-header');
    headerEl.textContent = list.name.toUpperCase();
    listEl.appendChild(headerEl);

    const contentEl = document.createElement('div');
    contentEl.classList.add('list-content');
    listEl.appendChild(contentEl);

    list.cards.forEach((card) => {
      Renderer.appendCard(contentEl, card);
    });

    const cardFooterEl = document.createElement('div');
    cardFooterEl.classList.add('list-footer-wrapper');
    cardFooterEl.innerHTML = `
      <div class="list-footer-button">
        <a href="#" data-type="showAddNew">+ Add another card</a>
      </div>
      <div class="list-footer-edit hidden">
        <form name="${list.id}">
            <textarea name="textarea"></textarea>
            <div>
               <button data-type="addNew">Add</button><a href="#" data-type="cancelAddNew">&#65794;</a>
            </div>
        </form>
      </div>
    `;

    listEl.appendChild(cardFooterEl);
    containerEl.appendChild(listEl);

    return containerEl;
  }

  static show(wrapper, className) {
    wrapper.querySelector(`.${className}`).classList.remove('hidden');
  }

  static hide(wrapper, className) {
    wrapper.querySelector(`.${className}`).classList.add('hidden');
  }

  static appendCard(container, card) {
    const cardEl = document.createElement('div');
    cardEl.dataset.id = card.id;
    cardEl.dataset.type = 'card';
    cardEl.innerHTML = `<span>${card.content}</span><a href="#" data-type="removeCard">&#65794;</a>`;
    cardEl.classList.add('card');

    container.appendChild(cardEl);
  }

  static getContentContainer(id) {
    const container = document.querySelector(`[data-id='${id}']`);
    return container.querySelector('.list-content');
  }

  static isDraggable(el) {
    return el?.classList.contains('card');
  }

  static getClosest(el, selector) {
    return el.closest(selector);
  }

  static getElementFromPoint(event) {
    return document.elementFromPoint(event.clientX, event.clientY);
  };

  static cloneNode(el, deep = true) {
    return el.cloneNode(deep);
  }

  static getBoundingClientRect(el) {
    return el.getBoundingClientRect();
  }

  static appendChild(target, el) {
    target.appendChild(el);
  }
}
