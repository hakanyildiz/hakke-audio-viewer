import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-material/paper-material.js'

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
            audio: {
                type: Object,
                notify: true
            },
            isSelected: {
                type: Boolean,
                value: false
            }            
        }
    }

    static get template() {
        return html `
            <style>
                :host {
                    display: block;
                }

                #dropArea{
                    font-size: 1.25rem;
                    position: relative;
                    padding: 50px 20px;
                    outline: 2px dashed var(--hakke-app-color);
                    outline-offset: -10px;
                    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
                    transition: outline-offset .15s ease-in-out, background-color .15s linear;
                    @apply --shadow-elevation-4dp;
                    @apply --shadow-transition;
                }

                #dropArea.highlight {
                    outline: 2px double var(--hakke-app-color);
                    @apply --shadow-elevation-12dp;
                } 

                #dropArea.highlight > * {
                    color: var(--hakke-app-color) !important;
                }

                #dropArea .box {
                    @apply --layout-vertical;
                    @apply --layout-center;
                }
                
                #dropArea .box iron-icon{
                    height: 3rem;
                    width: 100%;
                }
                
                #dropArea .box label strong {
                    cursor: pointer;
                    transition: all ease .3s;
                }

                #dropArea .box label strong:hover{
                    color: var(--hakke-app-color);
                }
                
                #selectedArea{
                    font-size: 1rem;
                    position: relative;
                    padding: 20px 20px;
                    background: var(--hakke-app-color);
                    color: #fff;
                    @apply --shadow-elevation-4dp;
                    @apply --shadow-transition;
                    
                }

                #selectedArea #closeSelectedArea {
                    position:absolute;
                    top: 15px;
                    right:15px;
                    width: 48px;
                    height: 48px;
                }

                #selectedArea .content {
                    @apply --layout-vertical;
                    @apply --layout-center-center;
                    align-items: self-start !important;
                }

                #selectedArea .content strong {
                    padding-top: 10px;
                }

                #fileElem {
                display: none;
                }
               
            </style>
            <paper-material elevation="1">
                <div id="dropArea">
                    <form class="box">
                        <iron-icon icon="icons:file-upload"></iron-icon>
                        <label for="fileElem"><strong>Dosya Seç</strong><span class="box__dragndrop"> ya da Buraya Sürükle</span>.</label>
                        <input type="file" id="fileElem" accept="audio/*">
                    </form>
                </div>
                <div id="selectedArea" hidden$=[[!isSelected]]>
                    <!-- <paper-icon-button id="closeSelectedArea" icon="icons:close" on-tap="_closeSelectedArea"></paper-icon-button> -->
                    <div class="content"> 
                        Seçmiş olduğunuz Dosya
                        <strong> [[audio.title]] </strong>
                    </div>
                </div>
               
            </paper-material>

            

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

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => this._preventDefaults(e));
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => this._highlight(e));
        });

        ['dragleave', 'drop'].forEach(eventName => {
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
        if (file.type.match(typeFilter)) {

            this.set('audio', {
                'src': URL.createObjectURL(files[0]),
                'title': files[0].name
            });
            this.set('isSelected', true);
            this.fireSelectEvent();

        } else {
            alert('only audio!');
        }

    }

    handleFiles(event) {
        console.log(event.target.files);
        var files = event.target.files;

        this._processFiles(files);
    }

    _highlight(e) {
        this.$.dropArea.classList.add('highlight');
    }

    _unhighlight(e) {
        this.$.dropArea.classList.remove('highlight');
    }

    _toggleClass(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    }

    _closeSelectedArea(e) {
        this.set('isSelected', !this.isSelected);
        this.fireSelectEvent();
    }

    fireSelectEvent() {
        var event = new CustomEvent('select', {bubbles: true, composed: true, detail: { 'selected': this.isSelected }});
        this.dispatchEvent(event);
    }

}

customElements.define('paper-audio-picker', PaperAudioPicker);