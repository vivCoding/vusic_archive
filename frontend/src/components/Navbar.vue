<template>
    <div id = "navContainer">
        <img id = "logo" src = "../assets/logoT.png">
        <div>
            <h1 id = "title">Vusic</h1>
            <h3 id = "subtitle">A Fast and Easy-to-Use Music Queuer</h3>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
#navContainer {
    display: flex;
    align-items: center;
    background: #2e2e2e;
    padding: 0 2em;
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
</style>