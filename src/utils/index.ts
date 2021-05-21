import CryptoJS from 'crypto-js'

export const HmacSHA256 = (message: string, key: string) => {
  return CryptoJS.HmacSHA256(message, key).toString()
}

export const SHA256 = (message: string) => {
  return CryptoJS.SHA256(message).toString()
}

export const SortParams = (obj: object) => {
  const customParams = {}
  Object.keys(obj)
    .sort()
    .forEach(function (key) {
      // @ts-ignore
      customParams[key] = obj[key]
    })
  return customParams
}

export const ConnectStr = (obj: object): string => {
  let strArr: string[] = []
  Object.keys(obj).forEach(function (key) {
    // @ts-ignore
    strArr.push(key + '=' + obj[key])
  })
  return strArr.join('&')
}
