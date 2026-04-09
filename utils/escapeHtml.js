const HTML_ENTITIES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export const escapeHtml = (value = "") => {
    return String(value).replace(/[&<>"']/g, (character) => {
        return HTML_ENTITIES[character];
    });
};
