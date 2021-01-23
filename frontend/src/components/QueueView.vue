<template>
    <div id = "queueMain">
        <h1>Song Queue</h1>
        <div id = "songList">
            <div v-if = "!songs.length" id = "noSongsDiv">
                <h2>No songs in queue right now!</h2>
                <h2>Songs you queue appear here</h2>
            </div>
            <SongView v-else v-for = "song in songs"
                :key = "song.id.videoId"
                :song = "song"
                :queued = "true"
                :class = "{ currentPlaying: currentSong != null && currentSong.queueId == song.queueId }"
                @playSong = "$emit('playSong', song)"
                @removeSong = "$emit('removeSong', song)"
                @moveSongForward = "$emit('moveSongForward', song)"
                @moveSongBackward = "$emit('moveSongBackward', song)"
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

    // methods: {
    //     removeSong(song) {
    //         this.$emit("removeSong", song);
    //     }
    // }
}
</script>

<style scoped>
#queueMain {
    width: 45vw;
    padding: 2em;
    padding-right: 5em;
}

#songList {
    height: 90%;
    /* background: green; */
    overflow-y: auto;
}

#noSongsDiv h2 {
    font-weight: 200;
}

.currentPlaying {
    background: green;
}

</style>