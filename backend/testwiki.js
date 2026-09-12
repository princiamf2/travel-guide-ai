const { searchWikipedia } = require("./services/wikiService");

async function test() {
    const result = await searchWikipedia(
        "Acropolis of Athens"
    );

    console.log(result);
}

test();