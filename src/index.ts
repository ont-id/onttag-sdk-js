import { sendUserInfo, getVcList } from "./api";
import { Base64Decode, generateId } from './utils/index'
import { countryList} from './utils/country'

const utils = {
  base64Decode:Base64Decode,
  generateId,
  countryList
}
export {
    sendUserInfo,
    getVcList,
    utils
}
