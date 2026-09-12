const ALLOWED_LEVELS = [
    "beginner",
    "intermediate",
    "advanced"
];

function normalizeText(value, defaultValue) {
    if (!value) {
        return defaultValue;
    }

    return value.toLowerCase().trim();
}

function parseBoolean(value) {
    if (!value) {
        return false;
    }

    const normalizedValue = value.toLowerCase().trim();

    return normalizedValue === "true" ||
            normalizedValue === "yes" ||
            normalizedValue === "1";
}

function validateUserOptions(level, style, allowedStyles) {
    const errors = [];

    if (!ALLOWED_LEVELS.includes(level)) {
        errors.push(
            `level must be one of: ${ALLOWED_LEVELS.join(", ")}`
        );
    }

    if (!allowedStyles.includes(style)) {
        errors.push(
            `style must be one of: ${allowedStyles.join(", ")}`
        );
    }

    return errors;
}

module.exports = {
    ALLOWED_LEVELS,
    normalizeText,
    parseBoolean,
    validateUserOptions
};