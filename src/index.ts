import { sendUserInfo, getVcList } from "./api";
import { deserialize, generateId } from './utils/index'
import { countryList} from './utils/country'

const utils = {
  deserialize,
  generateId,
  countryList
}
export {
    sendUserInfo,
    getVcList,
    utils
}
