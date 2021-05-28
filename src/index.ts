import { sendUserInfo, getVcList } from "./api";
import { Base64Decode, generateId } from './utils/index'
import { countryList} from './utils/country'
const initTest: string = 'hi, boy!';
const initWord: string = 'hi, girl!';

const utils = {
  base64Decode:Base64Decode,
  generateId,
  countryList
}
export {
    initTest,
    initWord,
    sendUserInfo,
    getVcList,
    utils
}
