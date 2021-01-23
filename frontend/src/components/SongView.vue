<template>
    <div id = "songContainer">
        <h1 id = "queueIdLabel">{{ queued ? song.queueId : "" }}</h1>
        <img :src = "song.snippet.thumbnails.default.url"/>
        <h2 id = "songTitle">{{ song.snippet.title }}</h2>
        <div>
            <button id = "actionButton" @click = "doAction">{{ queued ? "R" : "Q" }}</button>
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

    methods: {
        doAction() {
            if (!this.queued) {
                this.$emit("queueSong", this.song);
            } else if (this.queued) {
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
    /* background-color: green; */
    padding: 0em 1em;
}

#songContainer:hover {
    background-color: rgb(68, 78, 78);
}

#queueIdLabel {
    padding-right: 1em;
}

#songTitle {
    padding: 0.75em;
    width: 100%;
    font-size: 1.05vw;
}

#actionButton {
    /* width: 10em; */
    
}
</style>