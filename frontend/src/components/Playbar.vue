<template>
    <div id = "playbarContainer">
        <span>{{ currentTimeInMin }}</span>
        <input id = "audioControls" type ="range" :max = "duration" :value = "currentTime" @input="seekAudio" @change = "playAudioFromSeek"/>
        <span>{{ durationInMin }} </span>
        <br>
        <button @click = "audioPlaying ? pauseAudio() : resumeAudio()" :disabled = "songToPlay == null">{{ audioPlaying ? "Pause" : "Play" }}</button>
        <button @click = "skipSong">Skip</button>
        <button>Mute</button>
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
    },

    data: function() {
        return {
            duration: 0,
            currentTime: 0,
            audioSrc: document.getElementById("audioSrc"),
            playingLoop: null,
            audioPlaying: false,
            audioPaused: false,
        }
    },

    computed: {
        durationInMin() {
            return this.convertToMin(this.duration);
        },
        currentTimeInMin() {
            return this.convertToMin(this.currentTime);
        },
    },

    watch: {
        songToPlay(newSong) {
            console.log("stopping", videoId);
            if (this.audioPlaying && howler != null) {
                howler.stop();
                // TODO: why this giving error
                // howler.unload();
            }
            if (newSong != null) {
                this.playAudio();
            }
        },
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
                    console.log("playing");
                },
                onend: function() {
                    ref.$emit("songEnded");
                }
            })
            howler.play();
            this.playingLoop = setInterval(function() {
                ref.currentTime = howler.seek();
            }, 1)
        },
        seekAudio(e) {
            clearInterval(this.playingLoop);
            let newTime = e.target.value;
            this.currentTime = newTime;
        },
        playAudioFromSeek() {
            if (!this.paused) {
                howler.stop();
                howler.play();
                howler.seek(this.currentTime);
                let ref = this;
                this.playingLoop = setInterval(function() {
                    ref.currentTime = howler.seek();
                }, 1);
                this.audioPlaying = true;
            }
        },
        pauseAudio() {
            this.paused = true;
            howler.pause();
            clearInterval(this.playingLoop);
            this.audioPlaying = false;
            console.log("paused");
        },
        resumeAudio() {
            this.paused = false;
            this.playAudioFromSeek();
        },
        skipSong() {
            this.$emit("skipSong");
        }
    }
}
</script>

<style scoped>

#playbarContainer {
    width: 100%;
    text-align: center;
    padding: 2em 0;
}

#audioControls {
    -webkit-appearance: none;
    width: 70%;
    height: 1em;
    opacity: 0.7;
    background: #686868;
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
    border-radius: 1em;
    cursor: pointer;
}

#audioControls:hover {
    opacity: 1;
}

#audioControls::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    width: 1em;
    height: 1em;
    background: #00ff08;
    border-radius: 1em;
    cursor: pointer;
    outline: none;
    -webkit-transition: .25s;
    transition: .25s;
    /* box-shadow: -1vw 0 0 1vw #5be95f; */
}

#audioControls::-webkit-slider-thumb:hover {
    width: 1em;
    height: 2.5em;
}

/* ::-webkit-slider-runnable-track {
    background: #5be95f;
} */

#audioControls::-moz-range-thumb {
    -webkit-appearance: none; /* Override default look */
    width: 1em;
    height: 1em;
    background: #00ff08;
    border-radius: 1em;
    cursor: pointer;
    outline: none;
    -webkit-transition: .25s;
    transition: .25s;
}

#audioControls::-moz-range-thumb:hover {
    width: 1em;
    height: 2.5em;
}

</style>