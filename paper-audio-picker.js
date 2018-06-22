import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';

/**
 * `paper-audio-picker` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class PaperAudioPicker extends PolymerElement {
    static get properties() {
        return {

        }
    }

    static get template() {
        return html `
            <style>
                #drop-area {
                border: 2px dashed #ccc;
                border-radius: 20px;
                width: 480px;
                font-family: sans-serif;
                margin: 100px auto;
                padding: 20px;
                }
                #drop-area.highlight {
                border-color: purple;
                }
                p {
                margin-top: 0;
                }
                .my-form {
                margin-bottom: 10px;
                }
                #gallery {
                margin-top: 10px;
                }
                #gallery img {
                width: 150px;
                margin-bottom: 10px;
                margin-right: 10px;
                vertical-align: middle;
                }
                .button {
                display: inline-block;
                padding: 10px;
                background: #ccc;
                cursor: pointer;
                border-radius: 5px;
                border: 1px solid #ccc;
                }
                .button:hover {
                background: #ddd;
                }
                #fileElem {
                display: none;
                }
            </style>

            <div id="drop-area">
                <form class="my-form">
                    <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
                    <input type="file" id="fileElem" accept="audio/*">
                    <label class="button" for="fileElem">Select some files</label>
                </form>
            </div>

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
      * Called every time the element is inserted into the DOM. Useful for 
      * running setup code, such as fetching resources or rendering.
      * Generally, you should try to delay work until this time.
      */
    connectedCallback() {
        super.connectedCallback();
    
        this.$.fileElem.addEventListener('change', (e) => this.handleFiles(e));
    
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }

    handleFiles(event){


        var files = event.target.files;
        console.log('src', URL.createObjectURL(files[0]));

    }
}

customElements.define('paper-audio-picker', PaperAudioPicker);