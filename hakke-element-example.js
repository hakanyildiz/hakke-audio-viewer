import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';

/**
 * `hakke-audio-viewer`
 * Polymer 3 Element for uploading and previewing the audio files
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HakkeElement extends PolymerElement {
  static get properties() {
    return {
      foo: String,
      whales: Number,
      employees: Array
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        h4{
          pointer-events: none;
        }
      </style>

      <dom-repeat items="{{employees}}">
        <template>
          <div>First name: <span>{{item.first}}</span></div>
          <div>Last name: <span>{{item.last}}</span></div>
        </template>
      </dom-repeat>

      <paper-button raised>button</paper-button>

    `;
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
    this.foo = 'foo';

    this.employees = [
      { first: 'Hakke', last: 'Star' },
      { first: 'Uchiha', last: 'yoo' }
    ];

    this.addEventListener('click', async (e) => {
      console.log('event e ', e);
      this.whales++;
      await this.renderComplete;
      this.dispatchEvent(new CustomEvent('hakkewhales', { detail: { whales: this.whales } }))
    });
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }

  toggleThing(){
    if(condition) {
      // import('./lazy-element.js').then((LazyElement) => {
      //   console.log("LazyElement loaded");
      // }).catch((reason) => {
      //   console.log("LazyElement failed to load", reason);
      // });
      this.loadComplete = true;
    }
  }
}

customElements.define('hakke-element', HakkeElement);

