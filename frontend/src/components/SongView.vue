<template>
    <div id = "songContainer" :class = "{ fullButton: !queued }" @click = "doAction" @mouseenter = "isHovering = true" @mouseleave="isHovering = false">
        <h1 id = "queueIdLabel">{{ queued ? song.queueId : "" }}</h1>
        <img :src = "song.snippet.thumbnails.default.url"/>
        <h2 id = "songTitle">{{ songTitle }}</h2>
        <div id = "songButtons" :class = "{ hidden: !isHovering }">
            <div v-if = "!queued">
                <img class = "actionButton" src = "../assets/queue-white-18dp/2x/baseline_queue_white_18dp.png"/>
            </div>
            <div v-else>
                <img class = "actionButton" src = "../assets/arrow_downward-white-18dp/2x/baseline_arrow_downward_white_18dp.png"/>
                <img class = "actionButton" src = "../assets/arrow_upward-white-18dp/2x/baseline_arrow_upward_white_18dp.png"/>
                <img class = "actionButton" id = "removeButton" @click = "doAction" src = "../assets/close-white-18dp/2x/baseline_close_white_18dp.png"/>
            </div>
        </div>
    </div>
</template>

<script>
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
            return this.song.snippet.title.replaceAll("&#39;", "'").replaceAll("&amp;", "&");
        }
    },

    methods: {
        doAction(e) {
            if (!this.queued) {
                this.$emit("queueSong", this.song);
            } else if (this.queued && e.target.id == "removeButton") {
                this.$emit("removeSong", this.song);
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
}

#songContainer:hover {
    background-color: rgb(68, 78, 78);
}

.fullButton {
    cursor: pointer;
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