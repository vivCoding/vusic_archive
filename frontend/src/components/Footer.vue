<template>
    <div id = "footerMain">
        <a>About</a>
        <span class = "divider">-</span>
        <a href = "https://github.com/vivCoding/vusic">GitHub</a>
        <!-- <span class = "divider">-</span> -->
        <!-- <p>Created by ViV</p> -->
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>

#footerMain {
    display: flex;
    justify-content: center;
    align-items: stretch;
    padding: 0 1em;
    background-color: rgb(32, 32, 32);
}

#footerMain p {
    text-decoration: none;
    color: white;
    padding: 1em;
    font-size: 1.5em;
    margin: 0;
}

#footerMain a {
    text-decoration: none;
    color: white;
    padding: 1em;
    font-size: 1.5em;
}

#footerMain a:hover {
    background-color: rgb(0, 153, 255);
}

.divider {
    text-decoration: none;
    color: white;
    padding: 1em 0.5em;
    font-size: 1.5em;
    margin: 0;
    /* display: flex;
    align-items: center; */
}

</style>