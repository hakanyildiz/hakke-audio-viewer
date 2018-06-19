import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import './paper-audio-icons.js';

/**
 * `paper-audio-player` Description
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class PaperAudioPlayer extends mixinBehaviors([IronA11yKeysBehavior], PolymerElement) {
    static get properties() {
        return {
            src: {
                type: String,
                observer: "_srcChanged"
            },
            title: {
                type: String,
                value: 'Click to play this audio file'
            },
            color: {
                type: String,
                observer: '_changeColor'
            },
            autoPlay: {
                type: Boolean,
                value: false
            },
            preload: {
                type: String,
                value: 'auto'
            },
            currentTime: {
                type: Number,
                value: 0,
                notify: true
            },
            timeLeft: {
                type: Number,
                value: 0
            },
            smallSkip: {
                type: Number,
                value: 15
            },
            largeSkip: {
                type: Number,
                value: 60
            },
            error: {
                type: Boolean
            },
            timeOffset: {
                type: Number,
                value: 0
            },
            gaId: {
                type: String
            }
        }
    }

    static get template() {
        return html `
            <style>
                :host {
                    display: block;
                    /*margin: auto 10px;
                    width: 100%;*/
                    box-sizing: border-box;
                    font-family: 'Roboto Mono', 'Helvetica Neue', Arial, sans-serif;
                }
                [hidden] {
                    display: none !important;
                }
                #wrapper {
                    position: relative;
                    cursor: pointer;
                    height: 50px;
                    box-shadow: 0 1px 2px rgba(0,0,0,.3);
                }
                #left,
                #right {
                    height: 50px;
                    width: 50px;
                    position: relative;
                }
                #left {
                    background-color:  var(--paper-audio-player-color, blueviolet);
                }
                #right {
                    background-color: rgba(255,255,255,.75);
                }
                paper-icon-button,
                iron-icon {
                    color: #fff;
                }
                #duration,
                #title,
                #progress2 {
                    text-align: center;
                    line-height: 50px;
                }
                #duration {
                    font-size: 11px;
                    color: var(--paper-audio-player-color, blueviolet);
                }
                paper-icon-button,
                iron-icon {
                    margin: auto;
                }
                #replay {
                    opacity: 0;
                    color: var(--paper-audio-player-color, blueviolet);
                }
                #title,
                #progress2 {
                    pointer-events: none;
                    font-size: 15px;
                }
                #title {
                    z-index: 2;
                    color: var(--paper-audio-player-color, blueviolet);
                }
                #progress2 {
                    width: 0px;
                    z-index: 5;
                    color: #fff;
                    overflow: hidden;
                }
                #center {
                    position: relative;
                    overflow: hidden;
                    background-color: rgba(255,255,255,.75);
                }
                #progress {
                    width: 100%;
                    transform-origin: left;
                    transform: scaleX(0);
                    background-color: var(--paper-audio-player-color, blueviolet);
                }
                paper-ripple {
                    color: var(--paper-audio-player-color, blueviolet);
                }
                /* On hover */
                :host:not(.cantplay) #right:hover #replay {
                    opacity: 1;
                }
                #right:hover #duration {
                    opacity: 0;
                }
                #left:hover #play,
                #left:hover #pause {
                    transform: scale3d(1.1, 1.1, 1.1);
                    -ms-transform: scale3d(1.1, 1.1, 1.1);
                    -webkit-transform: scale3d(1.1, 1.1, 1.1);
                }
                /* On Error */
                :host(.cantplay) #title {
                    font-size: 12px;
                }
                :host(.cantplay) #wrapper {
                    cursor: default;
                }
                :host(.cantplay) #play {
                    opacity: 0;
                }
                /* Flexbox Helpers */
                .layout-horizontal {
                    display: flex;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    -ms-flex-direction: row;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                }
                .flex {
                    -ms-flex: 1;
                    -webkit-flex: 1;
                    flex: 1;
                }
                .fit {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }
                .self-start {
                    -ms-align-self: flex-start;
                    -webkit-align-self: flex-start;
                    align-self: flex-start;
                }
                .self-end {
                    -ms-align-self: flex-end;
                    -webkit-align-self: flex-end;
                    align-self: flex-end;
                }
            </style>

            <div id="wrapper" class="layout-horizontal">
                <div id="left" class="self-start" on-tap="playPause">
                [[isPlaying]]
                    <paper-icon-button id="play"
                        icon="av:play-arrow"
                        class="fit"
                        hidden$=[[_hidePlayIcon(isPlaying,canBePlayed)]]
                        role="button"
                        aria-label="Play Audio"
                        tabindex="-1">
                    </paper-icon-button>
                    <paper-icon-button id="pause"
                        icon="av:pause"
                        class="fit"
                        hidden$="{{ !isPlaying }}"
                        role="button"
                        aria-label="Pause Audio"
                        tabindex="-1">
                    </paper-icon-button>
                    <iron-icon id="error" icon="paper-audio-icons:error-outline" class="fit" hidden$="{{ !error }}"></iron-icon>
                </div>

                <div id="center" class="flex" on-down="_onDown">
                    <!-- Title -->
                    <div id="title" class="fit" role="alert">{{title}}</div>

                    <!-- Audio HTML5 element -->
                    <audio id="audio" src="{{ src }}" preload="{{ _setPreload(autoPlay, preload) }}"></audio>

                    <!-- Progress bar -->
                    <div id="progress" class="fit"></div>

                    <paper-ripple></paper-ripple>

                    <!-- Secondary white title -->
                    <div id="progress2" class="fit">
                         <div id="title2" aria-hidden="true">{{ title }}</div>
                    </div>
                </div>
                <div id="right"
                    class="self-end"
                    on-click="restart">

                    <!-- Duration -->
                    <div id="duration" class="fit" hidden$="{{ ended }}">
                    <span class="fit" role="timer" aria-label="Audio Track Length">{{ _convertSecToMin(timeLeft) }}</span>
                    </div>

                    <!-- Icon -->
                    <paper-icon-button id="replay"
                                    class="fit"
                                    icon="paper-audio-icons:replay"
                                    tabindex="-1"
                                    role="button"
                                    aria-label="Replay Audio"></paper-icon-button>
                </div>

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
        this.addEventListener('audio.loadedmetadata', this._onCanPlay());
        this.addEventListener('audio.playing', this._onPlaying());
        this.addEventListener('audio.pause', this._onPause());
        this.addEventListener('audio.ended', this._onEnd());
        this.addEventListener('audio.error', this._onError());
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();

        var player = this;

        // create Player defaults
        player.canBePlayed = false;
        player.isPlaying = false;
        player.ended = false;
        player.error = false;
        player.$.audio.currentTime = player.timeOffset; // apply the audio start time property

        // If 'ga-id' property is set,
        // prepare Google Analytics tracker
        if (!!player.gaId) player._setupGATracking();
    }

    // Play/Pause controls
    playPause(e) {

        console.log('playPause', e);
        if (!!e) e.preventDefault();
        var player = this;
        if (player.canBePlayed) {
            if (player.isPlaying) {
                player._pause();
            } else {
                player._play();
            }
        } else if (player.preload === 'none') {
            // If player can't be played, because audio wasn't pre-loaded
            // due to the preload="none" property set,
            // load the audio file at this point and start playing it immediately
            player.$.audio.load();
            player._play();
        }
    }
    _play() {
        var player = this;
        player.$.audio.play();
        // Dispatch 'Play' event to GA
        if (!!player.gaId) this._dispatchGAEvent('Play');
    }
    _pause() {
        var player = this;
        player.$.audio.pause();
        // Dispatch 'Pause' event to GA
        if (!!player.gaId) this._dispatchGAEvent('Pause');
    }
    //
    // Restart audio
    restart(e) {
        if (!!e) e.preventDefault();
        var player = this;
        player.$.audio.currentTime = 0;
        if (!player.isPlaying) player._play();
    }
    // when audio file can be played in user's browser
    _onCanPlay() {
        var player = this;
        player.canBePlayed = true;
        player.timeLeft = player.$.audio.duration;
        // If player has a Time Offset specified
        // style the progress bar and title accordingly
        if (player.timeOffset > 0) {
            var percentagePlayed = player.timeOffset / player.$.audio.duration;
            player._updateVisualProgress(percentagePlayed);
        }
        // If player has auto-play attribute set,
        // it ignores preload="none" property and starts playing on load.
        // This behavior corresponds to the native audio element behavior.
        if (player.autoPlay) player._play();
    }
    // when Player starts playing
    _onPlaying() {
        var player = this;
        player.ended = false;
        player.isPlaying = true;
        player.$.replay.style = ''; // remove Replay inline styling
        player._startProgressTimer();
    }
    //
    // Skip or reverse by pre-defined intervals
    _skipReverseByInterval(e) {
        if (!!e) e.preventDefault();
        var player = this,
            newTime = 0;
        switch (e.detail.key) {
            case 'up':
                if (player.largeSkip < player.timeLeft) newTime = player.currentTime + player.largeSkip;
                break;
            case 'down':
                if (player.currentTime - player.largeSkip > 0) newTime = player.currentTime - player.largeSkip;
                break;
            case 'right':
                if (player.smallSkip < player.timeLeft) newTime = player.currentTime + player.smallSkip;
                break;
            default:
                if (player.currentTime - player.smallSkip > 0) newTime = player.currentTime - player.smallSkip;
        }
        player._updatePlayPosition(newTime);
        if (!player.isPlaying) player._play();
    }
    // starts Timer
    _startProgressTimer() {
        var player = this;
        player.timer = {};
        if (player.timer.sliderUpdateInterval) {
            clearInterval(player.timer.sliderUpdateInterval);
        }
        player.timer.sliderUpdateInterval = setInterval(function () {
            if (player.isPlaying) {
                player.currentTime = player.$.audio.currentTime;
                player.timeLeft = player.$.audio.duration - player.currentTime;
                var percentagePlayed = player.currentTime / player.$.audio.duration;
                player._updateVisualProgress(percentagePlayed);
            } else {
                clearInterval(player.timer.sliderUpdateInterval);
            }
        }, 60);
    }
    // when Player is paused
    _onPause() {
        var player = this;
        player.isPlaying = false;
    }
    // when Player ended playing an audio file
    _onEnd() {
        var player = this;
        player.ended = true;
        player.isPlaying = false;
        player.$.replay.style.opacity = 1; // display Replay icon
        // Dispatch 'Ended' event to GA
        if (!!player.gaId) this._dispatchGAEvent('Ended');
    }
    // on file load error
    _onError() {
        var player = this;
        player.classList.add('cantplay');
        player.title = 'Sorry, can\'t play track: ' + player.title;
        player.error = true;
        player.setAttribute('aria-invalid', 'true');
    }
    // to convert seconds to 'm:ss' format
    _convertSecToMin(seconds) {
        if (seconds === 0) return '';
        var minutes = Math.floor(seconds / 60);
        var secondsToCalc = Math.floor(seconds % 60) + '';
        return minutes + ':' + (secondsToCalc.length < 2 ? '0' + secondsToCalc : secondsToCalc);
    }
    //
    // When user clicks somewhere on the progress bar
    _onDown(e) {
        console.log('onDown', e);
        e.preventDefault();
        var player = this;
        if (player.canBePlayed) {
            player._updateProgressBar(e);
            if (!player.isPlaying) {
                player._play();
            } else {
                // Audio is already playing,
                // so dispatch 'Scrub' event to GA
                if (!!player.gaId) this._dispatchGAEvent('Scrub');
            }
            // When preload="none" is being used,
            // player should first try to load the audio,
            // and when it's successfully loaded, recalculate the progress bar
        } else if (player.preload === 'none') {
            player.$.audio.load();
            player.$.audio.addEventListener('loadedmetadata', function () {
                player._updateProgressBar(e);
                if (!player.isPlaying) {
                    player._play();
                } else {
                    // Audio is already playing,
                    // so dispatch 'Scrub' event to GA
                    if (!!player.gaId) this._dispatchGAEvent('Scrub');
                }
            }, false);
        }
    }
    //
    // Helper function
    // that recalculates the progress bar position
    // based on the event.click position
    _updateProgressBar(e) {
        var player = this;
        var x = e.detail.x - player.$.center.getBoundingClientRect().left;
        var r = (x / player.$.center.getBoundingClientRect().width) * player.$.audio.duration;
        this._updatePlayPosition(r);
    }
    //
    // Helper function
    // updates the current time based on a time variable
    _updatePlayPosition(newTime) {
        var player = this;
        player.currentTime = player.$.audio.currentTime = newTime;
        var percentagePlayed = player.currentTime / player.$.audio.duration;
        player._updateVisualProgress(percentagePlayed);
    }
    //
    // Helper function
    // updates the progress bar based on a percentage played
    _updateVisualProgress(percentagePlayed) {
        var player = this;
        player.$.progress.style.transform = 'scaleX(' + percentagePlayed + ')';
        player.$.progress2.style.width = percentagePlayed * 100 + '%';
        player.$.title2.style.width = (1 / percentagePlayed) * 100 + '%';
    }
    //
    // If src is changed when track is playing,
    // pause the track and start playing a new src
    _srcChanged(oldValue, newValue) {
        var player = this;
        if (player.isPlaying) {
            player._pause();
            player._play();
        }
    }
    //
    // If color property is changed,
    // update all the nodes with the new accent color
    _changeColor(newValue) {
        var player = this;
        player.$.left.style.backgroundColor = newValue;
        player.$.title.style.color = newValue;
        player.$.duration.style.color = newValue;
        player.$.progress.style.backgroundColor = newValue;
        player.$.replay.style.color = newValue;
    }
    _hidePlayIcon(isPlaying, canBePlayed) {
        return isPlaying ? true : !(canBePlayed || this.preload === 'none');
    }
    _setPreload(autoplay, preload) {
        return autoplay ? 'auto' : preload;
    }
    //
    // Dispatch an event to Google Analytics
    _dispatchGAEvent(action) {
        var player = this;
        window.ga('audioTracker.send', 'event', {
            eventCategory: 'Paper Audio Player',
            eventAction: action,
            eventLabel: !!player.title ? player.title : player.src,
            eventValue: player.$.audio.currentTime
        });
    }
    _setupGATracking() {
        var player = this;
        // check if GA tracking exists on the page
        // if not - load it
        if (window) {
            if (!window.ga) {
                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            }
            window.ga('create', player.gaId, 'auto', 'audioTracker');
        }
    }
}

customElements.define('paper-audio-player', PaperAudioPlayer);