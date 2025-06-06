const dateFormat = (date) => {
    return date.toISOString().slice(0, 16).replace('T', ' ');
}

module.exports = dateFormat;