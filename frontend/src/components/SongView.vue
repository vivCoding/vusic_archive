<template>
    <div id = "songContainer"
        :class = "{ fullButton: !queued }"
        @click = "doAction"
        @mouseenter = "isHovering = true"
        @mouseleave="isHovering = false"
    >
        <h1 id = "queueIdLabel">{{ queued ? song.queueId : "" }}</h1>
        <img :src = "song.snippet.thumbnails.default.url"/>
        <h2 id = "songTitle">{{ songTitle }}</h2>
        <div id = "songButtons" :class = "{ hidden: !isHovering }">
            <div v-if = "!queued">
                <img class = "actionButton" src = "../assets/queue-white-18dp/2x/baseline_queue_white_18dp.png"/>
            </div>
            <div v-else>
                <img class = "actionButton" id = "backwardButton" src = "../assets/arrow_upward-white-18dp/2x/baseline_arrow_upward_white_18dp.png"/>
                <img class = "actionButton" id = "forwardButton" src = "../assets/arrow_downward-white-18dp/2x/baseline_arrow_downward_white_18dp.png"/>
                <img class = "actionButton" id = "removeButton" @click = "doAction" src = "../assets/close-white-18dp/2x/baseline_close_white_18dp.png"/>
            </div>
        </div>
    </div>
</template>

<script>
import he from "he";

export default {
    props: {
        song: {
            required: true,
            type: Object
        },
        queued: {
            required: true,
            type: Boolean
        },
    },

    data: function() {
        return {
            isHovering: false
        }
    },

    computed: {
        songTitle() {
            return he.decode(this.song.snippet.title);
        }
    },

    methods: {
        // TODO: refactor this messy sheet up
        doAction(e) {
            e.cancelBubble = true;
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (!this.queued) {
                this.$emit("queueSong", this.song);
            } else if (this.queued) {
                if (e.target.id == "removeButton") {
                    this.$emit("removeSong", this.song);
                } else if (e.target.id == "forwardButton") {
                    this.$emit("moveSongForward", this.song);
                } else if (e.target.id == "backwardButton") {
                    this.$emit("moveSongBackward", this.song);
                } else {
                    this.$emit("playSong", this.song);
                }
            }
        }
    }
}
</script>

<style scoped>
#songContainer {
    display: flex;
    align-items: center;
    height: 12em;
    padding: 0em 1em;
    border-radius: 1em;
    /* transition: 0.2s; */
    cursor: pointer;
}

#songContainer:hover {
    background-color: rgb(68, 78, 78);
}

/* .fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 1;
} */

#queueIdLabel {
    padding-right: 1em;
}

#songTitle {
    padding: 0.75em;
    padding-left: 1.1em;
    width: 100%;
    font-size: 1.05vw;
}

.hidden {
    visibility: hidden;
    /* opacity: 0; */
    /* transition: 0.2s; */
}

#songButtons div {
    display: flex;
    padding-right: 1.1em;
}

.actionButton {
    background: none;
    border: none;
    padding: 1.25em;
    margin: 0.1em;
    border-radius: 5em;
    cursor: pointer;
    transition: background-color 0.25s
}

.actionButton:hover {
    background-color: lightslategray;
}

</style>