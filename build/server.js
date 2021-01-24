const express = require("express");
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
const http = require("http").createServer(app);
http.listen(process.env.PORT || 5000, function() {
    console.log("App running on port 5000");
    console.log("-----------------------");
})

// socketio init
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
})
const redis = require("socket.io-redis");
// console.log(process.env.REDIS_URL);
// io.adapter(redis({
//     uri: process.env.REDIS_URL,
//     host: process.env.REDIS_HOST,
//     port: parseInt(process.env.REDIS_PORT),
//     key: process.env.REDIS_KEY
// }));

// serve SPA
app.get("/", (req, res) => {
    res.sendFile("index.html")
})

// get youtube search results
app.get("/searchresults", (req, res) => {
    let query = req.query.query;
    console.log("- received request for", query)

    youtube.search.list({
        part: "id, snippet",
        q: query,
        maxResults: process.env.MAX_RESULTS,
        type: "video",
        relevanceLanguage: "en"
    }).then(response => {
        if (response.status == 200) {
            // console.log(response);
            res.json(response);
        } else {
            res.status(500).send("error");
        }
    }).catch(error => {
        res.status(500).send("error", error);
    })
})

// play audio from youtube
app.get("/playaudio", (req, res) => {
    let videoId = req.query.videoid;
    console.log("- playing", videoId)
    try {
        ytdl("https://www.youtube.com/watch?v=" + videoId, options).pipe(res);
    } catch (exception) {
        res.status(500).send(exception);
    }
})

// room connection
io.on("connection", function(socket) {
    console.log("New client connected");
    socket.on("createRoom", function(data) {
        // generate room id
        let roomId = Math.random().toString(36).slice(7);
        socket.join(roomId);
        socket.emit("createRoomSuccess", roomId);
        console.log("- Client joined", roomId);
        // console.log(io.sockets.adapter.rooms.has(roomId));
    })

    socket.on("joinRoom", function(data) {
        if (io.sockets.adapter.rooms.has(data)) {
            socket.join(data);
            socket.emit("joinRoomSuccess", data);
        } else {
            socket.emit("joinRoomFailure", data);
        }
    })

    socket.on("getCurrent", function(data) {
        socket.to(data.roomId).emit("getCurrent", data);
    })

    socket.on("respondCurrent", function(data) {
        io.to(data.senderId).emit("receiveChanges", data);
    })

    socket.on("newChanges", function(data) {
        socket.to(data.roomId).emit("receiveChanges", data);
    })

    socket.on("disconnect", function() {
        console.log("Client disconnected!");
    })
})
