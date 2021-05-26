import {generateId} from "../src/utils";
import {countryList} from "../src/utils/country";
import { sendUserInfo } from "../src/api";
import { initTest } from "../src";
import { userInfo } from './info'
import Web3 from 'web3';

describe("test send user info", () => {
  test("test send user info", async () => {
    const ownerDid = generateId('0x5c7b386B2B8779304E701CbBE22a53671446629b');
    let result = await sendUserInfo({...userInfo,ownerDid}, '521113c1-9e5b-4d00-b137-c91ecad424ff');
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

describe("test verify sign", () => {
  test("test verify sign", async () => {
    const web3 = new Web3(Web3.givenProvider);
    let result = await web3.eth.accounts.recover('Some data', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c');
    console.log('result', result);
    expect(initTest).toBe('hi, boy!');
  })
})

describe("test sign msg", () => {
  test("test verify msg", async () => {
    const web3 = new Web3(Web3.givenProvider);
    const result = await web3.eth.accounts.sign('Some data', '39c5f2a46ba73c830116501caf71710fb8357200740ddda5fe60c26931a06faf');
    console.log('result', result);
    expect(initTest).toBe('hi, boy!');
  })
})

describe("test sign eth msg", () => {
  test("test verify eth msg", async () => {
    const web3 = new Web3(Web3.givenProvider);
    const result = await web3.eth.sign("Hello world", "0x5c7b386b2b8779304e701cbbe22a53671446629b")
    console.log('result', result);
    expect(initTest).toBe('hi, boy!');
  })
})
