import {countryList} from "../src/utils/country";
import { sendUserInfo } from "../src/api";
import { initTest } from "../src";

describe("test dessertFactoty feature", () => {
  test("produce all dessert", async () => {
    console.log(initTest);
    let params = {
      appId: 'string',
      "backDoc": 'string',
      "country": 'string',
      "docId": 'string',
      "docType": 'id_card',
      "frontDoc": 'string',
      "name": 'string',
      "ownerDid": 'string',
    }
    let result = await sendUserInfo(params, 'AKw9z5kHe8QgHdZccYzoeRU6JBgX4BpHeH');
    console.log('result', result)
    expect(initTest).toBe('hi, boy!');
  })
})

describe("test country list", () => {
  test("produce all dessert", () => {
    console.log(countryList);
    expect(initTest).toBe('hi, boy!');
  })
})
