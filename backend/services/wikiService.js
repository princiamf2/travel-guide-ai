async function searchWikipedia(title) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return {
        title: data.title,
        description: data.extract,
        image: data.thumbnail?.source || null
    };
}

module.exports = {
    searchWikipedia
};