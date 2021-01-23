<template>
    <div id = "searchMain">
        <input id = "searchInput" placeholder="Enter a song name, and start queuing!" v-model = "query"/>
        <h2>Results</h2>
        <div id = "resultsList">
            <p v-show = "makingRequest">Loading results...</p>
            <SongView v-show = "!makingRequest" v-for = "result in results" :key = "result.id.videoId" :song = "result" :queued = "false" @queueSong = "queueSong"/>
        </div>
    </div>
</template>

<script>
import SongView from "./SongView";
import { getSearchResults } from "../Requests";

export default {
    components: {
        SongView
    },

    data: function() {
        return {
            makingRequest: false,
            query: "",
            results: [
                // {
                //     id: {
                //         videoId: "KTZ-y85Erus"
                //     },
                //     snippet: {
                //         title: "That's Why I Gave Up On Music -Acoustic- (English Cover)【Will Stetson】「だから僕は音楽を辞めた」",
                //         thumbnails: {
                //             default: {
                //                 url: "https://i.ytimg.com/vi/HJAWN2wcQU4/default.jpg"
                //             }
                //         }
                //     }
                // },
                // {
                //     id: { videoId: "-VKIqrvVOpo"},
                //     snippet: {
                //         title: "ヨルシカ - ただ君に晴れ (MUSIC VIDEO)",
                //         thumbnails: {
                //             default: {
                //                 url: "https://i.ytimg.com/vi/-VKIqrvVOpo/default.jpg"
                //             }
                //         }
                //     }
                // }
            ],
        }
    },
    watch: {
        query() {
            if (!this.makingRequest) {
                this.makingRequest = true;
                setTimeout(this.updateResults, 2000);
            }
        }
    },

    methods: {
        updateResults() {
            console.log("searched", this.query);
            // this.makingRequest = false;
            getSearchResults(this.query).then(response => {
                this.results = response.items;
                this.makingRequest = false;
                console.log(response);
            })   
        },
        queueSong(song) {
            this.$emit("queueSong", song)
        }
    }
}
</script>

<style scoped>
#searchMain {
    border-left: 1px white solid;
    padding: 2em;
    width: 35vw;
}

#searchInput {
    width: 100%;
    background-color: rgb(87, 87, 87);
    height: 2em;
    color: white;
    padding: 0.25em 1em;
    border: rgb(119, 119, 119) solid;
    border-radius: 1em;
    font-family: monospace;
    font-size: 120%;
    outline: none;
}

#resultsList {
    height: 90%;
    overflow: auto;
}
</style>