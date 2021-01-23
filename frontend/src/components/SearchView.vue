<template>
    <div id = "searchMain">
        <div id = "searchBar">
            <input id = "searchInput" placeholder="Enter a song name, and start queuing!" v-model = "query"/>
            <!-- <button>Search</button> -->
        </div>
        <h1>Results</h1>
        <h3 v-show = "makingRequest" id = "loadingResultsMessage">Loading results...</h3>
        <div id = "resultsList">
            <h3 v-if = "error">Service is currently down right now. Please try again later!</h3>
            <SongView v-for = "result in results" :key = "result.id.videoId" :song = "result" :queued = "false" @queueSong = "queueSong"/>
        </div>
    </div>
</template>

<script>
import SongView from "./SongView";
import { getSearchResults, testResults } from "../Requests";

export default {
    components: {
        SongView
    },

    data: function() {
        return {
            makingRequest: false,
            query: "",
            results: testResults,
            error: false
        }
    },
    watch: {
        query() {
            if (this.query != "" && !this.makingRequest) {
                this.makingRequest = true;
                setTimeout(this.updateResults, 2000);
            }
        }
    },

    methods: {
        updateResults() {
            console.log("searched", this.query);
            this.makingRequest = true;
            getSearchResults(this.query).then(response => {
                if (response == "error") {
                    this.error = true;
                    console.log("error");
                } else {
                    this.results = response.items;
                    this.error = false;
                }
                document.getElementById("resultsList").scrollTop = 0;
                this.makingRequest = false;
            })   
        },
        queueSong(song) {
            this.$emit("queueSong", song);
        }
    }
}
</script>

<style scoped>
#searchMain {
    border-left: 0.25em lightgrey solid;
    padding: 2em;
    padding-left: 5em;
    width: 35vw;
}

#searchInput {
    width: 95%;
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
    width: 100%;
    height: 90%;
    overflow: auto;
    padding-right: 1em;
}

/* #loadingResultsMessage {
    margin: 0em;
} */

::-webkit-scrollbar-track {
    background: lime;
}
</style>