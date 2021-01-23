<template>
    <div>
        <div id = "main">
            <QueueView :songs = "queue"
                :currentSong = "currentSong"
                @removeSong = "removeSong"
            />
            <SearchView @queueSong = "queueSong"/>
        </div>
        <Playbar :songToPlay = "currentSong"
            @songEnded = "playNextSong"
            @skipSong = "playNextSong"
        />
    </div>
</template>

<script>
import Playbar from "./components/Playbar";
import SearchView from "./components/SearchView";
import QueueView from "./components/QueueView";

export default {
    name: 'App',
    components: {
        Playbar, SearchView, QueueView
    },
    
    data: function() {
        return {
            queue: [],
            currentSong: null,
            currentQueueIndex: 0,
            // playing: false,
            queueId: 1
        }
    },

    methods: {
        queueSong(song) {
            // deep clone
            let songToAdd = {
                queueId: this.queueId,
                id: {
                    videoId: song.id.videoId
                },
                snippet: {
                    title: song.snippet.title,
                    thumbnails: {
                        default: { url: song.snippet.thumbnails.default.url }
                    }
                }
            }
            this.queueId++;
            if (!this.queue.length) {
                this.currentSong = songToAdd;
            }
            this.queue.push(songToAdd);
        },
        playNextSong() {
            this.queue.shift();
            this.currentQueueIndex++;
            // if (this.currentQueueIndex < this.queue.length) {
            if (this.queue.length) {
                // this.currentSong = this.queue[this.currentQueueIndex];
                this.currentSong = this.queue[0];
            } else {
                this.currentSong = null;
            }
        },
        removeSong(songToRemove) {
            console.log("removing song");
            if (songToRemove.queueId == this.currentSong.queueId) {
                this.playNextSong();
            }
            this.queue = this.queue.filter(song => song.queueId != songToRemove.queueId);
        }
    }
};
</script>

<style scoped>
#main {
    width: 100%;
    height: 75vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>