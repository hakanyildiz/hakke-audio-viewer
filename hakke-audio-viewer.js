// Import an element
import '@polymer/paper-button/paper-button.js';
import './paper-audio-player.js';
import './paper-audio-picker.js';

// Import the PolymerElement base class and html helper
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
/**
 * `hakke-audio-viewer`
 * Polymer 3 Element for uploading and previewing the audio files
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HakkeAudioViewer extends PolymerElement {
  static get properties() {
    return {
        isSelected: {
          type: Boolean,
          notify: true
        },
        audio: {
          type: Object,
          notify: true
        }
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          /* master color of element*/
          --hakke-app-color: #ff7800;
        }
        :host([hidden]) {
          display: none;
        }

        paper-audio-player {
          margin-top: 10px
        }

      </style>
      <paper-audio-picker audio={{audio}} on-select="_handleEvent"></paper-audio-picker>
        
      <template is="dom-if" if=[[isSelected]]>
        <paper-audio-player audio=[[audio]]></paper-audio-player>
      <template>

    `;
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
    
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }

  _handleEvent(e) {
    // console.log('_deselectAudio', e);
    this.set('isSelected', e.detail.selected);
  }
}

customElements.define('hakke-audio-viewer', HakkeAudioViewer);

