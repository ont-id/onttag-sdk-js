module.exports = function npmTestFn(string) {
  if (typeof string !== 'string')
    throw new TypeError('ericyang wants a string!')
  return string.replace(/\s/g, '')
}
