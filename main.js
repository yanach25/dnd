(()=>{"use strict";var t,e=new Uint8Array(16);function s(){if(!t&&!(t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return t(e)}const i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;const a=function(t){return"string"==typeof t&&i.test(t)};for(var d=[],n=0;n<256;++n)d.push((n+256).toString(16).substr(1));const o=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=(d[t[e+0]]+d[t[e+1]]+d[t[e+2]]+d[t[e+3]]+"-"+d[t[e+4]]+d[t[e+5]]+"-"+d[t[e+6]]+d[t[e+7]]+"-"+d[t[e+8]]+d[t[e+9]]+"-"+d[t[e+10]]+d[t[e+11]]+d[t[e+12]]+d[t[e+13]]+d[t[e+14]]+d[t[e+15]]).toLowerCase();if(!a(s))throw TypeError("Stringified UUID is invalid");return s};const r=function(t,e,i){var a=(t=t||{}).random||(t.rng||s)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,e){i=i||0;for(var d=0;d<16;++d)e[i+d]=a[d];return e}return o(a)};class l{constructor(t,e=[],s=null){this.name=t,this.id=s??r(),this.cards=e}addCard(t){this.cards.push(t)}setCardToPosition(t,e){this.cards.splice(e,0,t)}addCards(t){this.cards=[...this.cards,...t]}removeCard(t){const e=this.cards.find((e=>e.id===t));this.cards=this.cards.filter((t=>t!==e))}}class c{constructor(t,e=null){this.content=t,this.id=e??r()}}class h{static renderInitial(t){const e=document.querySelector("#app");t.forEach((t=>{e.appendChild(h.renderList(t))}))}static renderList(t){const e=document.createElement("div");e.classList.add("container");const s=document.createElement("div");s.dataset.id=t.id,s.classList.add("list-wrapper");const i=document.createElement("div");i.classList.add("list-header"),i.textContent=t.name.toUpperCase(),s.appendChild(i);const a=document.createElement("div");a.classList.add("list-content"),s.appendChild(a),t.cards.forEach((t=>{h.appendCard(a,t)}));const d=document.createElement("div");return d.classList.add("list-footer-wrapper"),d.innerHTML=`\n      <div class="list-footer-button">\n        <a href="#" data-type="showAddNew">+ Add another card</a>\n      </div>\n      <div class="list-footer-edit hidden">\n        <form name="${t.id}">\n            <textarea name="textarea"></textarea>\n            <div>\n               <button data-type="addNew">Add</button><a href="#" data-type="cancelAddNew">&#65794;</a>\n            </div>\n        </form>\n      </div>\n    `,s.appendChild(d),e.appendChild(s),e}static show(t,e){t.querySelector(`.${e}`).classList.remove("hidden")}static hide(t,e){t.querySelector(`.${e}`).classList.add("hidden")}static appendCard(t,e){const s=document.createElement("div");s.dataset.id=e.id,s.dataset.type="card",s.innerHTML=`<span>${e.content}</span><a href="#" data-type="removeCard">&#65794;</a>`,s.classList.add("card"),t.appendChild(s)}static getContentContainer(t){return document.querySelector(`[data-id='${t}']`).querySelector(".list-content")}static isDraggable(t){return t?.classList.contains("card")}static getClosest(t,e){return t.closest(e)}static getElementFromPoint(t){return document.elementFromPoint(t.clientX,t.clientY)}static cloneNode(t,e=!0){return t.cloneNode(e)}static getBoundingClientRect(t){return t.getBoundingClientRect()}static appendChild(t,e){t.appendChild(e)}}class g{constructor(){this.lists=[],this.registerListeners()}init(){const t=localStorage.getItem("lists");t?this.load(t):(this.lists=["todo","in progress","done"].map((t=>new l(t))),this.save()),h.renderInitial(this.lists)}registerListeners(){this.watchDnD(),this.watchClick()}watchDnD(){document.addEventListener("mousedown",(t=>{if(h.isDraggable(t.target)){this.draggedEl=t.target,this.ghostEl=h.cloneNode(t.target,!0);const{x:e,y:s,width:i}=h.getBoundingClientRect(t.target);this.ghostEl.style.width=i-40+"px",this.ghostEl.classList.add("dragging"),this.ghostEl.style.boxShadow="none",this.ghostEl.style.padding="10px";this.ghostEl.querySelector("a").remove(),h.appendChild(document.body,this.ghostEl),this.draggedEl.classList.add("hidden"),this.offsetX=t.pageX-e-10,this.offsetY=t.pageY-s-10,this.ghostEl.style.position="absolute",this.ghostEl.style.top=t.pageY-this.offsetY+"px",this.ghostEl.style.left=t.pageX-this.offsetX+"px"}})),document.addEventListener("mousemove",(t=>{const e=h.getElementFromPoint(t);if(this.ghostEl){if(this.ghostEl.style.top=t.pageY-this.offsetY+"px",this.ghostEl.style.left=t.pageX-this.offsetX+"px",e?.classList.contains("shadow"))return;const s=document.querySelector(".shadow"),i=h.isDraggable(e);if((!i&&s||i&&s&&e.nextElementSibling!==s)&&s.remove(),i&&e.nextElementSibling===s)return;const a=h.cloneNode(this.draggedEl);if(a.classList.remove("hidden"),a.classList.add("shadow"),i)e?.parentNode?.insertBefore(a,e.nextElementSibling);else{const t=e?.closest(".container"),s=t?.querySelector(".list-content");s?.appendChild(a)}}})),document.addEventListener("mouseup",(()=>{if(this.ghostEl){const t=document.querySelector(".shadow");if(document.body.removeChild(this.ghostEl),t){const e=this.draggedEl.closest(".list-wrapper").dataset.id,s=t.closest(".list-wrapper").dataset.id,i=this.draggedEl.dataset.id,a=this.lists.find((t=>t.id===e)),d=t.parentNode.querySelectorAll(".card"),n=Array.from(d).findIndex((e=>e===t)),o=a.cards.find((t=>t.id===i));a.removeCard(i);this.lists.find((t=>t.id===s)).setCardToPosition(o,n),this.save(),this.draggedEl.remove(),t.classList.remove("shadow")}else this.ghostEl.remove(),this.draggedEl.classList.remove("hidden");this.ghostEl=null,this.draggedEl=null}}))}watchClick(){let t;document.addEventListener("click",(e=>{e.preventDefault();const s=h.getClosest(e.target,".list-wrapper");if(s?.dataset?.id){const i=s.dataset.id;switch(e.target.dataset.type){case"showAddNew":g.showEditable(s);break;case"cancelAddNew":g.hideEditable(s),t=h.getClosest(e.target,"form"),t.reset();break;case"addNew":t=h.getClosest(e.target,"form");const a=new FormData(t).get("textarea");if(a){const e=new c(a),s=h.getContentContainer(i);h.appendCard(s,e),t.reset();this.lists.find((t=>t.id===i)).addCard(e),this.save()}break;case"removeCard":const d=h.getClosest(e.target,".card");this.lists.find((t=>t.id===i)).removeCard(d.dataset.id),this.save(),d.remove()}}}))}load(t){try{const e=JSON.parse(t);this.lists=e.map((t=>{const e=t.cards.map((t=>new c(t.content,t.id)));return new l(t.name,e,t.id)}))}catch(t){console.error(t)}}save(){localStorage.setItem("lists",JSON.stringify(this.lists))}static showEditable(t){h.hide(t,"list-footer-button"),h.show(t,"list-footer-edit")}static hideEditable(t){h.show(t,"list-footer-button"),h.hide(t,"list-footer-edit")}}(new g).init()})();