<template>
    <div id = "playbarContainer">
        <div id = "audioTimeline">
            <span class = "timeLabel">{{ playTimeInMin }}</span>
            <input id = "audioSlider" type ="range"
                :max = "duration"
                :value = "playTime"
                :disabled = "!audioPlaying && !audioPaused"
                @input = "seekAudio"
                @change = "playAudioFromSeek"
            />
            <span class = "timeLabel">{{ durationInMin }} </span>
        </div>
        <div id = "audioButtons">
            <button @click = "setLoop" :class = "{ buttonEnabled: audioLoop }">
                <img src = "../assets/loop-white-18dp/2x/baseline_loop_white_18dp.png"/>
            </button>
            <button @click = "$emit('previousSong')">
                <img src = "../assets/skip_previous-white-18dp/2x/baseline_skip_previous_white_18dp.png"/>
            </button>
            <button @click = "audioPlaying ? pauseAudio() : resumeAudio()">
                <img v-if = "audioPlaying" src = "../assets/pause_circle_outline-white-36dp/2x/baseline_pause_circle_outline_white_36dp.png"/>
                <img v-else src = "../assets/play_circle_outline-white-36dp/2x/baseline_play_circle_outline_white_36dp.png"/>
            </button>
            <button @click = "$emit('skipSong')">
                <img src = "../assets/skip_next-white-18dp/2x/baseline_skip_next_white_18dp.png"/>
            </button>
            <button @click = "muteAudio" :class = "{ buttonEnabled: audioMuted }">
                <img v-if = "!audioMuted" src = "../assets/volume_up-white-18dp/2x/baseline_volume_up_white_18dp.png"/>
                <img v-else src = "../assets/volume_off-white-18dp/2x/baseline_volume_off_white_18dp.png"/>
            </button>
        </div>
    </div>
</template>

<script>
// import PlayCircle from "vue-material-design-icons/PlayCircle"
import { url } from "../Requests";
import { Howl } from "howler";


let howler = null;
let videoId = "";

export default {
    components: {
        // PlayCircle
    },
    props: {
        songToPlay: {
            required: true,
            type: Object
        },
        playAtTime: {
            type: Number
        },
        pausedState: {
            type: Boolean
        },
        loopState: {
            type: Boolean
        }
    },

    data: function() {
        return {
            duration: 0,
            playingLoop: null,
            playTime: 0,
            audioPlaying: false,
            audioPaused: false,
            audioMuted: false,
            audioLoop: false,
        }
    },

    computed: {
        durationInMin() {
            return this.convertToMin(this.duration);
        },
        playTimeInMin() {
            return this.convertToMin(this.playTime);
        },
    },

    watch: {
        songToPlay(newSong) {
            // console.log("song has changed!", newSong != null ? newSong.snippet.title : null);
            console.log("new song");
            clearInterval(this.playingLoop);
            if (howler != null) {
                howler.stop();
                howler.unload();
            }
            if (newSong != null) {
                this.playAudio();
            }
        },
        playAtTime(newTime) {
            console.log("new play time");
            if (howler != null) {
                howler.stop();
                howler.play();
                this.playTime = this.playAtTime;
                howler.seek(newTime);
                console.log(newTime);
            }
        },
        pausedState(paused) {
            if (paused) {
                this.pauseAudio()
            } else {
                this.resumeAudio();
            }
        },
        loopState(looping) {
            if (looping) {
                this.audioLoop = true;
            } else {
                this.audioLoop = false;
            }
            if (howler != null)
                howler.loop(this.audioLoop);
        }
    },

    methods: {
        convertToMin(time) {
            let min = Math.floor(time / 60);
            let sec = Math.floor(time - min * 60);
            return (min % 10 == min ? "0" + min : min) + ":" + (sec % 10 == sec ? "0" + sec : sec)
        },
        playAudio() {
            let ref = this;
            videoId = this.songToPlay.id.videoId;
            howler = new Howl({
                src: url + "/playaudio?videoid=" + videoId,
                html5: true,
                onload: function() {
                    ref.duration = howler.duration();
                    ref.audioPlaying = true;
                },
                onend: function() {
                    if (!ref.audioLoop) {
                        ref.$emit("songEnded");
                        ref.audioPlaying = false;
                        clearInterval(this.playingLoop);
                    }
                },
            })
            howler.play();
            howler.seek(this.playAtTime)
            howler.volume(this.audioMuted ? 0 : 1);
            this.setCurrentTimeInterval();
        },
        seekAudio(e) {
            clearInterval(this.playingLoop);
            let newTime = e.target.value;
            this.playTime = newTime;
            // this.$emit("updateCurrentTime", newTime);
            // console.log(this.currentTime);
        },
        playAudioFromSeek() {
            if (!this.pausedState && howler != null) {
                howler.stop();
                howler.play();
                // console.log(this.currentTime);
                howler.seek(parseInt(this.playTime));
                this.$emit("sendCurrentTime", this.playTime);
                this.setCurrentTimeInterval();
                this.audioPlaying = true;
            }
        },
        pauseAudio() {
            this.$emit("audioPaused", true);
            this.audioPaused = true;
            if (howler != null)
                howler.pause();
            clearInterval(this.playingLoop);
            this.audioPlaying = false;
        },
        resumeAudio() {
            this.$emit("audioPaused", false);
            this.audioPaused = false;
            this.playAudioFromSeek();
        },
        muteAudio() {
            this.audioMuted = !this.audioMuted;
            if (howler != null)
                howler.volume(this.audioMuted ? 0 : 1);
        },
        setLoop() {
            this.audioLoop = !this.audioLoop;
            this.$emit("audioLoop", this.audioLoop);
            if (howler != null)
                howler.loop(this.audioLoop);
        },
        setCurrentTimeInterval() {
            let ref = this;
            this.playingLoop = setInterval(function() {
                ref.playTime = howler.seek();
                ref.$emit("updateCurrentTime", howler.seek());
            }, 100);
        }
    }
}
</script>

<style scoped>

#playbarContainer {
    width: 100%;
    text-align: center;
    /* margin-top: 6em; */
    padding: 2em 0 1em 0;
    background-color: rgb(43, 43, 43);
}

#audioTimeline {
    display: flex;
    justify-content: center;
    align-items: center;
}

.timeLabel {
    padding: 0 0.5em;
    font-size: 130%;
}

#audioSlider {
    -webkit-appearance: none;
    width: 70%;
    height: 1em;
    background: #505050;
    outline: none;
    -webkit-transition: .2s;
    transition: .2s;
    border-radius: 1em;
    cursor: pointer;
}

#audioSlider:hover {
    background: #686868;
}

#audioSlider::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    width: 1em;
    height: 1em;
    background: lime;
    border-radius: 1em;
    cursor: pointer;
    outline: none;
    -webkit-transition: .25s;
    transition: .25s;
    /* box-shadow: -1vw 0 0 1vw #5be95f; */
}

#audioSlider::-webkit-slider-thumb:hover {
    width: 1em;
    height: 2.5em;
}

#audioSlider::-moz-range-thumb {
    -webkit-appearance: none; /* Override default look */
    width: 1em;
    height: 1em;
    background: lime;
    border-radius: 1em;
    box-shadow: lime;
    cursor: pointer;
    outline: none;
    -webkit-transition: .25s;
    transition: .25s;
}

#audioSlider::-moz-range-thumb:hover {
    width: 1em;
    height: 2.5em;
}

#audioButtons {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5em;
}

.buttonEnabled {
    background: rgb(124, 124, 124);
    border-radius: 5em;
    /* padding: 1em; */
}

button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75em;
    display: flex;
    transition: 0.2s
}

button:hover {
    opacity: 0.5;
}

</style>