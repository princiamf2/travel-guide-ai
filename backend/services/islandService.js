function normalizeIslandName(value) {
    return value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/-/g, " ");
}

function getAvailableStyles(guide) {
    const styles = [];

    guide.islands.forEach((island) => {
        island.good_for.forEach((style) => {
            if (!styles.includes(style)) {
                styles.push(style);
            }
        });
    });
    return styles;
}

module.exports = {
    normalizeIslandName,
    getAvailableStyles,
}