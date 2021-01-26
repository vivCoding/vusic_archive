<template>
    <div>
        <Navbar :roomId = "roomId"
            @createRoom = "createRoom"
            @joinRoom = "joinRoom"
            @leaveRoom = "leaveRoom"
        />
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
        <Playbar ref = "audioPlayer"
            :currentTime = "currentTime"
            :playAtTime = "playAtTime"
            :songToPlay = "currentSong"
            :pausedState = "audioPaused"
            :loopState = "audioLoop"
            @audioPaused = "updatePausedState"
            @audioLoop = "updateLoopState"
            @songEnded = "playNextSong"
            @skipSong = "playNextSong"
            @previousSong = "playPreviousSong"
            @updateCurrentTime = "updateCurrentTime"
            @sendCurrentTime = "sendCurrentTime"
        />
        <Footer/>
    </div>
</template>

<script>
import Navbar from "./components/Navbar";
import QueueView from "./components/QueueView";
import SearchView from "./components/SearchView";
import Playbar from "./components/Playbar";
import Footer from "./components/Footer";

import { url } from "./Requests";
import { io } from "socket.io-client";
let socket = null;

export default {
    name: 'App',
    components: {
        Playbar, SearchView, QueueView, Navbar, Footer
    },
    
    data: function() {
        return {
            currentSong: null,
            currentTime: 0,
            playAtTime: 0,
            queue: [],
            currentQueueIndex: 0,
            pausedState: false,
            audioPlaying: false,
            audioPaused: false,
            audioLoop: false,
            nextQueueId: 1,
            roomId: "none",
        }
    },

    methods: {
        queueSong(song) {
            // deep clone
            let songToAdd = {
                queueId: this.nextQueueId,
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


            this.nextQueueId++;
            this.queue.push(songToAdd);
            let changedItems = {
                nextQueueId: this.nextQueueId,
                queue: this.queue
            }
            if (!this.audioPlaying) {
                this.currentSong = songToAdd;
                this.currentQueueIndex = this.queue.length - 1;
                this.audioPlaying = true;
                
                changedItems.currentSong = songToAdd;
                changedItems.currentQueueIndex = this.currentQueueIndex;
                changedItems.audioPlaying = true;
            }
            
            this.sendChanges(changedItems);
        },
        playNextSong() {
            this.currentTime = 0;
            this.playAtTime = 0;
            let changedItems = {
                currentTime: 0
            }
            if (this.currentQueueIndex < this.queue.length - 1) {
                this.currentQueueIndex++;
                this.currentSong = this.queue[this.currentQueueIndex];
                this.audioPlaying = true;

                changedItems.currentQueueIndex = this.currentQueueIndex;
                changedItems.currentSong = this.currentSong;
                changedItems.audioPlaying = true;
            } else {
                this.currentSong = null;
                this.audioPlaying = false;

                changedItems.currentSong = null;
                changedItems.audioPlaying = false;
            }

            this.sendChanges(changedItems);
        },
        playPreviousSong() {
            this.currentTime = 0;
            this.playAtTime = 0;
            let changedItems = {
                currentTime: 0
            }
            if (this.currentQueueIndex > 0) {
                if (this.currentQueueIndex > this.queue.length - 1) {
                    this.currentQueueIndex = this.queue.length - 1;
                } else {
                    this.currentQueueIndex--;
                }
                this.currentSong = this.queue[this.currentQueueIndex];
                this.audioPlaying = true;

                changedItems.currentQueueIndex = this.currentQueueIndex;
                changedItems.currentSong = this.currentSong;
                changedItems.audioPlaying = true;
            }

            this.sendChanges(changedItems);
        },
        removeSong(songToRemove) {
            console.log("removing song", songToRemove.snippet.title, songToRemove.queueId);
            let changedItems = {}
            if (this.currentSong != null) {
                if (songToRemove.queueId < this.currentSong.queueId) {
                    this.currentQueueIndex--;
                    changedItems.currentQueueIndex = this.currentQueueIndex;
                }
                if (songToRemove.queueId == this.currentSong.queueId) {
                    this.playNextSong();
                }
            }
            this.queue = this.queue.filter(song => song.queueId !== songToRemove.queueId);
            changedItems.queue = this.queue;
            this.sendChanges(changedItems);
        },
        playSong(song) {
            console.log("playing different song from order");
            this.currentSong = song;
            this.audioPlaying = true;
            this.currentTime = 0;
            this.playAtTime = 0;
            let changedItems = {
                currentSong: song,
                audioPlaying: true,
                currentTime: 0
            }
            for (let i = 0; i < this.queue.length; i++) {
                if (this.queue[i].queueId == this.currentSong.queueId) {
                    this.currentQueueIndex = i;
                    break;
                }
            }

            changedItems.currentQueueIndex = this.currentQueueIndex;
            this.sendChanges(changedItems);
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
                if (this.currentSong.queueId == song.queueId) {
                    this.currentQueueIndex++;
                }
            }
            let changedItems = {
                queue: this.queue,
                currentQueueIndex: this.currentQueueIndex
            }
            this.sendChanges(changedItems);
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
                if (this.currentSong.queueId == song.queueId) {
                    this.currentQueueIndex--;
                }
            }
            let changedItems = {
                queue: this.queue,
                currentQueueIndex: this.currentQueueIndex
            }
            this.sendChanges(changedItems);
        },
        updateCurrentTime(newCurrentTime) {
            this.currentTime = newCurrentTime;
        },
        sendCurrentTime(newCurrentTime) {
            this.currentTime = newCurrentTime;
            this.sendChanges({
                currentTime: this.currentTime
            });
        },
        updatePausedState(paused) {
            this.audioPaused = paused;
            this.sendChanges({
                audioPaused: this.audioPaused
            })
        },
        updateLoopState(looping) {
            this.audioLoop = looping;
            this.sendChanges({
                audioLoop: this.audioLoop
            })
        },
        createRoom() {
            socket = io(url);
            socket.emit("createRoom");
            socket.on("createRoomSuccess", data => {
                this.roomId = data;
            })
            this.setupSocket();
        },
        joinRoom(roomToJoin) {
            socket = io(url);
            socket.emit("joinRoom", roomToJoin);
            socket.once("joinRoomSuccess", data => {
                this.roomId = data;
                console.log("Joined room", this.roomId);
                socket.emit("getCurrent", {
                    roomId: data,
                    senderId: socket.id
                });
            });
            socket.once("joinRoomFailure", data => {
                alert("Could not find room " + data + "!");
                socket.close();
            })
            this.setupSocket();
        },
        leaveRoom() {
            socket.close();
            this.roomId = "none";
        },
        setupSocket() {
            console.log("setting up socket")
            socket.on("receiveChanges", data => {
                let keys = Object.keys(data);
                keys.forEach(key => {
                    this[key] = data[key];
                    if (key == "currentTime") {
                        this.playAtTime = this.currentTime;
                        // console.log(this.playAtTime, this.currentTime);
                    }
                })
            });
            socket.on("getCurrent", data => {
                console.log("Getting my current....");
                socket.emit("respondCurrent", {
                    roomId: data.roomId,
                    senderId: data.senderId,
                    currentSong: this.currentSong,
                    currentTime: this.currentTime,
                    queue: this.queue,
                    currentQueueIndex: this.currentQueueIndex,
                    audioPlaying: this.audioPlaying,
                    nextQueueId: this.nextQueueId,
                    audioPaused: this.audioPaused,
                    audioLoop: this.audioLoop
                });
            })
        },
        sendChanges(data) {
            if (socket != null && socket.connected) {
                data.roomId = this.roomId;
                data.senderId = socket.id;
                socket.emit("newChanges", data);
                console.log("sent changed");
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