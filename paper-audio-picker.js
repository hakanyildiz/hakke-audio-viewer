import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icons/iron-icons.js'

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
            src: {
                type: String,
                notify: true
            }
        }
    }

    static get template() {
        return html `
            <style>
                #dropArea {
                    font-size: 1.25rem;
                    background-color: #c8dadf;
                    position: relative;
                    padding: 100px 20px;
                    outline: 2px dashed #92b0b3;
                    outline-offset: -10px;
                    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
                    transition: outline-offset .15s ease-in-out, background-color .15s linear;
                    @apply --shadow-elevation-4dp;
                    @apply --shadow-transition;
                }
                #dropArea.highlight {
                    border-color: purple;
                    @apply --shadow-elevation-12dp;
                } 

                #dropArea .box {
                    @apply --layout-vertical;
                    @apply --layout-center;
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

            <div id="dropArea">
                <form class="box">

                    <iron-icon icon="icons:file-upload"></iron-icon>
                    <label for="fileElem"><strong>Dosya Seç</strong><span class="box__dragndrop"> ya da Buraya Sürükle</span>.</label>
                    <!-- <p>Seçili Ses Dosyası => [[title]]</p> -->
                    <input type="file" id="fileElem" accept="audio/*">
                    <!-- <label class="button" for="fileElem">Ses Dosyası Seç</label> -->
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
        
        let dropArea = this.$.dropArea;

        ['dragenter', 'dragover', 'dragleave','drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => this._preventDefaults(e));
        });

        ['dragenter','dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => this._highlight(e));
        });

        ['dragleave','drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => this._unhighlight(e));
        });

        dropArea.addEventListener('drop', (e) => this._handleDrop(e));
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }

    _preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    _handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        this._processFiles(files);
    }

    _processFiles(files) {

        const typeFilter = /audio.*/;
        let file = files[0];
        if ( file.type.match(typeFilter) ) {
            
            this.set('src', URL.createObjectURL(files[0]));
            this.set('title', files[0].name);
        }
        else {
            alert('only audio!');
        }

    }
    
    handleFiles(event){
        console.log(event.target.files);
        var files = event.target.files;

        this._processFiles(files);
    }

    _highlight(e){
        this.$.dropArea.classList.add('highlight');
    }

    _unhighlight(e){
        this.$.dropArea.classList.remove('highlight');
    }

    _toggleClass(element, className) {
        if ( element.classList.contains(className)) {
            element.classList.remove(className);
        }
        else {
            element.classList.add(className);
        }
    }

}

customElements.define('paper-audio-picker', PaperAudioPicker);