const dateFormat = (date) =>{
    return date.toISOString().slice(0, 10)
}

module.exports = dateFormat;