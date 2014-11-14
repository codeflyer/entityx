module.exports = function(name) {
    return "this._setData('" + name + "', details." + name + ");\n"
}