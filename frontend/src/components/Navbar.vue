<template>
    <div id = "navContainer">
        <img id = "logo" src = "../assets/logoT.png">
        <div>
            <h1 id = "title">Vusic</h1>
            <h3 id = "subtitle">A Fast and Easy-to-Use Music Queuer</h3>
        </div>
        <div id = "roomInfo">
            <h2 id = "currentRoomLabel">Current Room: {{ roomId }}</h2>
            <div v-if = "roomId == 'none'">
                <button class = "roomButton" @click = "createRoom">Create Room</button>
                <button class = "roomButton" @click = "joinRoom">Join Room</button>
            </div>
            <button v-else class = "roomButton" id = "leaveRoomButton" @click = "leaveRoom">Leave Room</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        roomId: {
            required: true,
            type: String
        }
    },

    data: function() {
        return {
            inRoom: false
        }
    },

    methods: {
        createRoom() {
            this.$emit("createRoom");
        },
        joinRoom() {
            let roomToJoin = prompt("Enter room id:");
            if (roomToJoin == null) return;
            if (roomToJoin != "") {
                this.$emit("joinRoom", roomToJoin);
            } else {
                alert("Invalid room ID!")
            }
        },
        leaveRoom() {
            this.$emit("leaveRoom");
        }
    }
}
</script>

<style scoped>
#navContainer {
    display: flex;
    align-items: center;
    background: #2e2e2e;
    padding: 0 2em;
    padding-right: 5em;
}

#logo {
    width: 7em;
    padding: 0 1em;
    /* border-radius: 3em; */
}

#title {
    margin: 0;
    font-weight: 1000;
}

#subtitle {
    margin: 0
}

#roomInfo {
    margin-left: auto;
    display:flex;
    align-items: center;
}

#currentRoomLabel {
    margin-right: 2em;
}

.roomButton {
    margin: 0.5em;
    border: none;
    background-color: rgb(0, 153, 255);
    color: white;
    padding: 0.75em;
    font-size: 150%;
    font-weight: bolder;
    font-family: monospace;
    border-radius: 0.5em;
    cursor: pointer;
}

.roomButton:hover {
    opacity: 0.7;
}

#leaveRoomButton {
    background-color: rgb(214, 0, 0);
}
</style>