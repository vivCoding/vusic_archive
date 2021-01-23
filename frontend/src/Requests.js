export let url = "http://10.192.87.50:5000";

export async function getSearchResults(query) {
    let response = await fetch(url + "/searchresults?query=" + query);
    if (response.status != 200) {
        return "error";
    }
    return response.json();
}

export let testResults = [
    {
        id: {
            videoId: "KTZ-y85Erus"
        },
        snippet: {
            title: "That's Why I Gave Up On Music「だから僕は音楽を辞めた」",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/HJAWN2wcQU4/default.jpg"
                }
            }
        }
    },
    {
        id: { videoId: "-VKIqrvVOpo"},
        snippet: {
            title: "ヨルシカ - ただ君に晴れ (MUSIC VIDEO)",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/-VKIqrvVOpo/default.jpg"
                }
            }
        }
    },
    {
        id: { videoId: "vleS5vua5-Y" },
        snippet: {
            title: "Bastille - WHAT YOU GONNA DO??? ft. Graham Coxon",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/vleS5vua5-Y/default.jpg"
                }
            }
        }
    },
    {
        id: { videoId: "T4q55Ljwav0" },
        snippet: {
            title: "Bastille - Live Session Absolute Radio: Pompeii, Survivin&#39;, What You Gonna Do??? &amp; More",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/T4q55Ljwav0/default.jpg"
                }
            }
        }
    },
    {
        id: { videoId: "Sw1Flgub9s8" },
        snippet: {
            title: "ヨルシカ - 春泥棒（OFFICIAL VIDEO",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/Sw1Flgub9s8/default.jpg"
                }
            }
        }
    }, {
        id: { videoId: "F64yFFnZfkI" },
        snippet: {
            title: "ヨルシカ - 言って。(Music Video)",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/F64yFFnZfkI/default.jpg"
                }
            }
        }
    }
]