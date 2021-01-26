<template>
    <div id = "searchMain">
        <div id = "searchBar">
            <!-- TODO: instead of v-model, search when user has stopped typing -->
            <!-- TODO: add command-line like interface  -->
            <input id = "searchInput" placeholder="Enter a song name, and start queuing!" v-model = "query"/>
        </div>
        <h1>Results</h1>
        <h3 v-show = "searching" id = "searchingMessage">Searching...</h3>
        <h3 v-show = "makingRequest" id = "loadingResultsMessage">Loading results...</h3>
        <div id = "resultsList">
            <h3 v-show = "error">Service is currently down right now. Please try again later!</h3>
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
            searching: false,
            makingRequest: false,
            requestTimeout: null,
            query: "",
            results: [],
            error: false,
        }
    },
    watch: {
        query() {
            this.searching = true;
            clearTimeout(this.requestTimeout);
            this.requestTimeout = setTimeout(this.updateResults, 1250);
        }
    },

    methods: {
        updateResults() {
            this.searching = false;
            if (this.query != "") {
                console.log("searched:", this.query);
                this.makingRequest = true;
                getSearchResults(this.query).then(response => {
                    if (response == "error") {
                        this.error = true;
                        console.log("error");
                    } else {
                        this.results = response.data.items;
                        this.error = false;
                    }
                    document.getElementById("resultsList").scrollTop = 0;
                    this.makingRequest = false;
                }).catch(error => {
                    this.makingRequest = false;
                    this.error = true;
                })
            }
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