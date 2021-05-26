import CryptoJS from 'crypto-js'

export const HmacSHA256 = (message: string, key: string) => {
  return CryptoJS.HmacSHA256(message, key).toString()
}

export const SHA256 = (message: string) => {
  return CryptoJS.SHA256(message).toString()
}

/**
 *
 * @param obj input params type of object
 * @returns Objects sorted by key
 */
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

/**
 *
 * @param obj input params
 * @returns String concatenated by &
 */
export const ConnectStr = (obj: object): string => {
  let strArr: string[] = []
  Object.keys(obj).forEach(function (key) {
    // @ts-ignore
    strArr.push(key + '=' + obj[key])
  })
  return strArr.join('&')
}

/**
 *
 * @param obj input params
 * @returns output params
 */
export const serializeParameter = (obj: object): object => {
  return obj;
}

/**
 *
 * @param account eth account address
 * @returns id string
 */
export const generateId = (account: string): string => {
  if (!account) {
    throw new Error('No account')
  }
  if (account.indexOf('0x') <= -1) {
    throw new Error('Incorrect account format')
  }
  return 'did:bsc:' + account.substring(2, account.length);
}
