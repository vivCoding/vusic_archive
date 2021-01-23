const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const {google} = require("googleapis");
const ytdl = require("ytdl-core");

dotenv.config();

// youtube init
const youtube = google.youtube({
    version: "v3",
    auth: process.env.AUTH
})
const options = {
    quality: "lowest", 
    audioFormat: "mp3"
}

// express init
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")))

// http and server init
http.createServer(app).listen(5000, function() {
    console.log("Backend running on port 5000");
})

app.get("/", (req, res) => {
    res.send("<body style = 'background-color:black;color:white;padding:2em'>Server is running now!</body>")
})

// get youtube search results

async function getSearchResults(query) {
    // TODO: catch errors
    let response = await youtube.search.list({
        part: "id, snippet",
        q: query,
        maxResults: 50,
        type: "video"
    });
    return response.data;
}

app.get("/searchresults", (req, res) => {
    let query = req.query.query;
    getSearchResults(query).then(response => {
        res.json(response);
    })
})

// play audio from youtube
app.get("/playaudio", (req, res) => {
    let videoId = req.query.videoid;
    try {
        ytdl("https://www.youtube.com/watch?v=" + videoId, options).pipe(res);
    } catch (exception) {
        res.status(500).send(exception);
    }
})
