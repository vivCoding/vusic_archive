export let url = "http://10.192.87.50:5000";

export async function getSearchResults(query) {
    let response = await fetch(url + "/searchresults?query=" + query);
    return response.json();
}