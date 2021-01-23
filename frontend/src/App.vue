<template>
    <div>
        <Navbar/>
        <div id = "main">
            <QueueView :songs = "queue"
                :currentSong = "currentSong"
                @removeSong = "removeSong"
                @playSong = "playSong"
                @moveSongForward = "moveSongForward"
                @moveSongBackward = "moveSongBackward"
            />
            <SearchView @queueSong = "queueSong"/>
        </div>
        <Playbar :songToPlay = "currentSong"    
            @songEnded = "playNextSong"
            @skipSong = "playNextSong"
            @previousSong = "playPreviousSong"
        />
    </div>
</template>

<script>
import Navbar from "./components/Navbar";
import QueueView from "./components/QueueView";
import SearchView from "./components/SearchView";
import Playbar from "./components/Playbar";

export default {
    name: 'App',
    components: {
        Playbar, SearchView, QueueView, Navbar
    },
    
    data: function() {
        return {
            queue: [],
            currentSong: null,
            currentQueueIndex: 0,
            audioPlaying: false,
            queueId: 1
        }
    },

    watch: {
        currentQueueIndex(newNum) {
            console.log(newNum);
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
            this.queue.push(songToAdd);
            if (!this.audioPlaying) {
                this.currentSong = songToAdd;
                this.currentQueueIndex = this.queue.length - 1;
                this.audioPlaying = true;
            }
        },
        playNextSong() {
            if (this.currentQueueIndex < this.queue.length - 1) {
                this.currentQueueIndex++;
                this.currentSong = this.queue[this.currentQueueIndex];
                this.audioPlaying = true;
            } else {
                this.currentSong = null;
                this.audioPlaying = false;
            }
        },
        playPreviousSong() {
            if (this.currentQueueIndex > 0) {
                if (this.currentQueueIndex > this.queue.length - 1) {
                    this.currentQueueIndex = this.queue.length - 1;
                } else {
                    this.currentQueueIndex--;
                }
                this.currentSong = this.queue[this.currentQueueIndex];
                this.audioPlaying = true;
            }
        },
        removeSong(songToRemove) {
            console.log("removing song", songToRemove.snippet.title, songToRemove.queueId);
            if (this.currentSong != null) {
                if (songToRemove.queueId == this.currentSong.queueId) {
                    this.playNextSong();
                }
                if (songToRemove.queueId < this.currentSong.queueId) {
                    this.currentQueueIndex--;
                }
            }
            this.queue = this.queue.filter(song => song.queueId !== songToRemove.queueId);
        },
        playSong(song) {
            console.log("playing different song from order")
            this.currentSong = song;
            for (let i = 0; i < this.queue.length; i++) {
                if (this.queue[i].queueId == this.currentSong.queueId) {
                    this.currentQueueIndex = i;
                    break;
                }
            }
        },
        // TODO: refactor this sheet and create function to find index of song in queue
        moveSongForward(song) {
            let temp = null;
            let index = 0;
            for (let i = 0; i < this.queue.length - 1; i++) {
                if (this.queue[i].queueId == song.queueId) {
                    temp = this.queue[i + 1];
                    index = i;
                    break;
                }
            }
            if (temp != null) {
                this.queue[index + 1] = song;
                this.queue[index] = temp;
            }
        },
        moveSongBackward(song) {
            let temp = null;
            let index = 0;
            for (let i = 1; i < this.queue.length; i++) {
                if (this.queue[i].queueId == song.queueId) {
                    temp = this.queue[i - 1];
                    index = i;
                    break;
                }
            }
            if (temp != null) {
                this.queue[index - 1] = song;
                this.queue[index] = temp;
            }
        }
    }
};
</script>

<style scoped>
#main {
    width: 100%;
    height: 65vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 3em 0;
}
</style>