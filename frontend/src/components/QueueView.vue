<template>
    <div id = "queueMain">
        <h1>Current Queue</h1>
        <div id = "songList">
            <SongView v-for = "song in songs"
                :key = "song.id.videoId"
                :song = "song"
                :queued = "true"
                @removeSong = "removeSong"
                :class = "{ currentPlaying: currentSong != null && currentSong.queueId == song.queueId }"
            />
        </div>
    </div>
</template>

<script>
import SongView from "./SongView"

export default {
    components: {
        SongView
    },
    props: {
        songs: {
            required: true,
            type: Array
        },
        currentSong: {
            required: true,
            type: Object
        }
    },

    methods: {
        removeSong(song) {
            this.$emit("removeSong", song);
        }
    }
}
</script>

<style scoped>
#queueMain {
    width: 45vw;
    padding: 1em;
}

#songList {
    height: 90%;
    /* background: green; */
    overflow-y: auto;
}

.currentPlaying {
    background: green;
}

</style>