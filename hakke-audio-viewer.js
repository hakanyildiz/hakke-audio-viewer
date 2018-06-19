// Import an element
import '@polymer/paper-button/paper-button.js';
import './paper-audio-player.js';

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
      </style>
      <paper-audio-player color="#F05C38" src="./testMusic.wav"></paper-audio-player>
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
}

customElements.define('hakke-audio-viewer', HakkeAudioViewer);

