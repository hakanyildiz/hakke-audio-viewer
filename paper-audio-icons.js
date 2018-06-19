import { PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
/**
 * `paper-audio-icons` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class PaperAudioIcons extends PolymerElement {
    static get properties() {
        return {

        }
    }

    static get template() {
        return html`
            <iron-iconset-svg name="paper-audio-icons" size="24">
                <svg>
                    <defs>
                        <g id="error-outline"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></g>
                        <g id="play-arrow"><path d="M8 5v14l11-7z"/></g>
                        <g id="replay"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></g>
                        <g id="pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></g>
                    </defs>
                </svg>
            </iron-iconset-svg>
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

customElements.define('paper-audio-icons', PaperAudioIcons);