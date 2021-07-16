import { AuthType, chainType } from "./type";
import { sendUserInfo, getVcList, getSocialAuthLink } from "./api";
import { deserialize, generateId, serializeSignMessage, createPresentation, } from './utils'
import { areaList } from './utils/country'

const utils = {
  deserialize,
  generateId,
  areaList,
  serializeSignMessage,
  authType: AuthType,
  chainType,
  createPresentation,
  getSocialAuthLink
}
export {
  sendUserInfo,
  getVcList,
  utils
}
