import { DocType, chainType } from "./type";
import { sendUserInfo, getVcList } from "./api";
import { deserialize, generateId, serializeSignMessage, createPresentation, } from './utils'
import { areaList } from './utils/country'

const utils = {
  deserialize,
  generateId,
  areaList,
  serializeSignMessage,
  docType: DocType,
  chainType,
  createPresentation
}
export {
  sendUserInfo,
  getVcList,
  utils
}
