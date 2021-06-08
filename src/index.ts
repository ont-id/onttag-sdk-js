import { DocType, chainType } from "./type";
import { sendUserInfo, getVcList } from "./api";
import { deserialize, generateId, serializeSignMessage, } from './utils/index'
import { areaList } from './utils/country'

const utils = {
  deserialize,
  generateId,
  areaList,
  serializeSignMessage,
  docType: DocType,
  chainType
}
export {
  sendUserInfo,
  getVcList,
  utils
}
