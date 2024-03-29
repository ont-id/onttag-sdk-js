import { Claim, Credentials, Crypto, utils } from 'ontology-ts-sdk'
// @ts-ignore
import * as base58 from 'base-58';
import Web3 from 'web3';
import moment from 'moment';
import {getSocialAuthLink, getVcList, sendUserInfo} from "../src/api";
import {AuthType, chainType, signMessageType} from '../src/type/index'
import {
  Base64Decode,
  deserialize,
  generateId,
  HmacSHA256,
  serializeSignMessage,
  createPresentation,
  SHA256
} from "../src/utils";
import { areaList } from "../src/utils/country";
// import { userInfo } from './info';

describe("test user info", () => {
  // test("send user info", async () => {
  //   const ownerDid = generateId('0x5c7b386B2B8779304E701CbBE22a53671446629b', chainType.ETH);
  //   let result = await sendUserInfo({ ...userInfo, ownerDid }, '521113c1-9e5b-4d00-b137-c91ecad424ff');
  //   console.log('result', result)
  // }, 30000)
  test("get user vc", async () => {
    // const accountId = generateId('0x5c7b386B2B8779304E701CbBE22a53671446629b', chainType.ETH);
    // did:ont:0x5c7b386B2B8779304E701CbBE22a53671446629b
    const accountId = 'did:eth:5c7b386B2B8779304E701CbBE22a53671446629'
    const result = await getVcList(accountId, AuthType.Twitter);
    console.log('result', result);
  })
})

describe("test country list", () => {
  test("produce all dessert", () => {
    console.log(areaList);
  })
  test("test address to hex", () => {
   //  AUokgZN93vGemHootneWfuhogShVZCz6nX
   //  utils.ab2hexstring()
    const decoded = base58.decode('AUokgZN93vGemHootneWfuhogShVZCz6nX');
    const hexEncoded =  utils.ab2hexstring(decoded).substr(2, 40);
    console.log('hexEncoded', hexEncoded)

    const ADDR_VERSION = '17';
    const data = ADDR_VERSION + hexEncoded;
    const hash = utils.sha256(data);
    const hash2 = utils.sha256(hash);
    const checksum = hash2.slice(0, 8);
    const datas = data + checksum;
    const ontAddress = base58.encode(new Buffer(datas, 'hex'));
    console.log('ontAddress', ontAddress)
  })
})


describe("test hmac fn", () => {
  test("HmacSHA256", () => {
    // let a = {
    //   age: 12,
    //   name: 'zzzz'
    // }
    let str = HmacSHA256('age=12&name=zzzz', '22222')
    console.log('str', str)
  })
})

describe("test verify sign", () => {
  test("test verify sign", async () => {
    const web3 = new Web3(Web3.givenProvider);
    let str = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpldGg6NWM3YjM4NkIyQjg3NzkzMDRFNzAxQ2JCRTIyYTUzNjcxNDQ2NjI5YiNrZXlzLTEifQ.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJqdGkiOiJkaWQ6ZXRoOjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIiLCJhdWQiOiJkaWQ6b250OkFVb2tnWk45M3ZHZW1Ib290bmVXZnVob2dTaFZaQ3o2blgiLCJuYmYiOjE2MjM0MDYwMjI2MzAsImlhdCI6MTYyMzQwNjAyMjYzMCwiZXhwIjoxNjIzNDA4NjE0NjMwLCJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWxzIjpbImV5SmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwdmJuUTZRVkJqT0VaQ1pFZFpaSHBFZEZkeVJuQTRjVEpDVTFWR1dESklRVzVDZFVKdVlTTnJaWGx6TFRFaUxDSjBlWEFpT2lKS1YxUWlmUT09LmV5SnBjM01pT2lKa2FXUTZiMjUwT2tGUVl6aEdRbVJIV1dSNlJIUlhja1p3T0hFeVFsTlZSbGd5U0VGdVFuVkNibUVpTENKbGVIQWlPakUyTlRRNU5ERTVNamtzSW01aVppSTZNVFl5TXpRd05Ua3lPU3dpYVdGMElqb3hOakl6TkRBMU9USTVMQ0pxZEdraU9pSjFjbTQ2ZFhWcFpEcGhPR0V6WWpRMllpMDBabVEwTFRRNE1tUXRPVGxoTXkwM09UZzVNVGRpWXprM01EUWlMQ0oyWXlJNmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNJc0ltaDBkSEJ6T2k4dmIyNTBhV1F1YjI1MExtbHZMMk55WldSbGJuUnBZV3h6TDNZeElpd2lZM0psWkdWdWRHbGhiRHB6Wm5CZmNHRnpjM0J2Y25SZllYVjBhR1Z1ZEdsallYUnBiMjRpWFN3aWRIbHdaU0k2V3lKV1pYSnBabWxoWW14bFEzSmxaR1Z1ZEdsaGJDSmRMQ0pqY21Wa1pXNTBhV0ZzVTNWaWFtVmpkQ0k2ZXlKT1lXMWxJam9pU0ZOVlFVNGdXVUZPUnlJc0lrSnBjblJvUkdGNUlqb2lNVGs1TkMwd015MHdPU0lzSWtWNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1pMHdNeTB4TWlJc0lrbEVSRzlqVG5WdFltVnlJam9pUlUweU5qQXpPRFlpTENKSmMzTjFaWEpPWVcxbElqb2lVMmgxWm5ScGNISnZJaXdpZFhObGNsOWthV1FpT2lKa2FXUTZaWFJvT2pWak4ySXpPRFpDTWtJNE56YzVNekEwUlRjd01VTmlRa1V5TW1FMU16WTNNVFEwTmpZeU9XSWlmU3dpWTNKbFpHVnVkR2xoYkZOMFlYUjFjeUk2ZXlKcFpDSTZJalkxWkRNMU56ZGpaV1ZtWlRCbE5qZ3dNRFZtWm1Fek5UQTFOamhqTnpVeVlUZ3lNamxsTmpBaUxDSjBlWEJsSWpvaVFYUjBaWE4wUTI5dWRISmhZM1FpZlN3aWNISnZiMllpT25zaVkzSmxZWFJsWkNJNklqSXdNakV0TURZdE1URlVNVEE2TURVNk1qbGFJaXdpY0hKdmIyWlFkWEp3YjNObElqb2lZWE56WlhKMGFXOXVUV1YwYUc5a0luMTlmUT09LkFjLzd0eU91aENFdFl6RWcvSW42VllDcEhtaGlDeml6dkNOc2dXOVIzSHlCSkkvUzlqSzc0eHZ1ZGRMK3ROUW81R1JMUU9SQnNZcTBHcXYwT3JMelYwWT0iXX19';
    let result = await web3.eth.accounts.recover('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x0ba6ff730ff6fc788cc140fde32edad881ba71d959434c10626032166f75536f239af71ce6a3a38c0c945275e7b7ed423d915160b892b58d3454070e9a662faa1b');
    console.log('result', result);
  })
})

describe("test sign msg", () => {
  test("test sign msg", async () => {
    const web3 = new Web3(Web3.givenProvider);
    let str = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpldGg6NWM3YjM4NkIyQjg3NzkzMDRFNzAxQ2JCRTIyYTUzNjcxNDQ2NjI5YiNrZXlzLTEifQ.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJqdGkiOiJkaWQ6ZXRoOjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIiLCJhdWQiOiJkaWQ6b250OkFVb2tnWk45M3ZHZW1Ib290bmVXZnVob2dTaFZaQ3o2blgiLCJuYmYiOjE2MjM0MDYwMjI2MzAsImlhdCI6MTYyMzQwNjAyMjYzMCwiZXhwIjoxNjIzNDA4NjE0NjMwLCJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWxzIjpbImV5SmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwdmJuUTZRVkJqT0VaQ1pFZFpaSHBFZEZkeVJuQTRjVEpDVTFWR1dESklRVzVDZFVKdVlTTnJaWGx6TFRFaUxDSjBlWEFpT2lKS1YxUWlmUT09LmV5SnBjM01pT2lKa2FXUTZiMjUwT2tGUVl6aEdRbVJIV1dSNlJIUlhja1p3T0hFeVFsTlZSbGd5U0VGdVFuVkNibUVpTENKbGVIQWlPakUyTlRRNU5ERTVNamtzSW01aVppSTZNVFl5TXpRd05Ua3lPU3dpYVdGMElqb3hOakl6TkRBMU9USTVMQ0pxZEdraU9pSjFjbTQ2ZFhWcFpEcGhPR0V6WWpRMllpMDBabVEwTFRRNE1tUXRPVGxoTXkwM09UZzVNVGRpWXprM01EUWlMQ0oyWXlJNmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNJc0ltaDBkSEJ6T2k4dmIyNTBhV1F1YjI1MExtbHZMMk55WldSbGJuUnBZV3h6TDNZeElpd2lZM0psWkdWdWRHbGhiRHB6Wm5CZmNHRnpjM0J2Y25SZllYVjBhR1Z1ZEdsallYUnBiMjRpWFN3aWRIbHdaU0k2V3lKV1pYSnBabWxoWW14bFEzSmxaR1Z1ZEdsaGJDSmRMQ0pqY21Wa1pXNTBhV0ZzVTNWaWFtVmpkQ0k2ZXlKT1lXMWxJam9pU0ZOVlFVNGdXVUZPUnlJc0lrSnBjblJvUkdGNUlqb2lNVGs1TkMwd015MHdPU0lzSWtWNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1pMHdNeTB4TWlJc0lrbEVSRzlqVG5WdFltVnlJam9pUlUweU5qQXpPRFlpTENKSmMzTjFaWEpPWVcxbElqb2lVMmgxWm5ScGNISnZJaXdpZFhObGNsOWthV1FpT2lKa2FXUTZaWFJvT2pWak4ySXpPRFpDTWtJNE56YzVNekEwUlRjd01VTmlRa1V5TW1FMU16WTNNVFEwTmpZeU9XSWlmU3dpWTNKbFpHVnVkR2xoYkZOMFlYUjFjeUk2ZXlKcFpDSTZJalkxWkRNMU56ZGpaV1ZtWlRCbE5qZ3dNRFZtWm1Fek5UQTFOamhqTnpVeVlUZ3lNamxsTmpBaUxDSjBlWEJsSWpvaVFYUjBaWE4wUTI5dWRISmhZM1FpZlN3aWNISnZiMllpT25zaVkzSmxZWFJsWkNJNklqSXdNakV0TURZdE1URlVNVEE2TURVNk1qbGFJaXdpY0hKdmIyWlFkWEp3YjNObElqb2lZWE56WlhKMGFXOXVUV1YwYUc5a0luMTlmUT09LkFjLzd0eU91aENFdFl6RWcvSW42VllDcEhtaGlDeml6dkNOc2dXOVIzSHlCSkkvUzlqSzc0eHZ1ZGRMK3ROUW81R1JMUU9SQnNZcTBHcXYwT3JMelYwWT0iXX19';
    console.log('SHA256(str)', SHA256(str));
    const result = await web3.eth.accounts.sign('4596b147fbf54566e279169cc1d40c2fb15e1883c75ccaacea40f326be1f99ee', '57aa4b1fa4f1bc6824d8ed3cea202b4753e0734ccd94a4a7ba941a3f46739cce');
    console.log('result', result);
  })
})

describe("test sign eth msg", () => {
  test("test verify eth msg", async () => {
    const web3 = new Web3(Web3.givenProvider);
    const result = await web3.eth.sign("Hi, Alice!", "0x5c7b386b2b8779304e701cbbe22a53671446629b")
    console.log('result', result);
  })
})

describe("test sign verify message", () => {
  test("test sign verify message", async () => {
    let str = 'eyJraWQiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEja2V5cy0xIiwidHlwIjoiSldULVgiLCJhbGciOiJPTlQtRVMyNTYifQ==.eyJjbG0tcmV2Ijp7InR5cCI6IkF0dGVzdENvbnRyYWN0IiwiYWRkciI6IjM2YmI1YzA1M2I2YjgzOWM4ZjZiOTIzZmU4NTJmOTEyMzliOWZjY2MifSwic3ViIjoiZGlkOm9udDpBS0c5TlRIZGV0Ynh0cUR4Wm11azRTYlNoekFYb3p1Nmo3IiwidmVyIjoidjEuMCIsImNsbSI6eyJOYXRpb25hbGl0eSI6IkJFIiwiTmFtZSI6IkhTVUFOWUFORyIsIkJpcnRoRGF5IjoiMTk5NC0wMy0wOSIsIkV4cGlyYXRpb25EYXRlIjoiMjAyMi0wMy0xMiIsIklERG9jTnVtYmVyIjoiRU0yNjAzODYiLCJJc3N1ZXJOYW1lIjoiU2h1ZnRpcHJvIn0sImlzcyI6ImRpZDpvbnQ6QVBjOEZCZEdZZHpEdFdyRnA4cTJCU1VGWDJIQW5CdUJuYSIsImV4cCI6MTYyODg1NTU0NSwiaWF0IjoxNTk3MzE5NTQ2LCJAY29udGV4dCI6ImNyZWRlbnRpYWw6c2ZwX3Bhc3Nwb3J0X2F1dGhlbnRpY2F0aW9uIiwianRpIjoiYjdhMDAyNDZmOTk1MDhmZWNlNTMxNDM4ZjEwZjU1YWU2MGM4M2VmMTFkMjQwZjg3M2RjNDNjMmVjMjk0OGExNCJ9.Ads7y0bkRN4yl7ei8RvVJDW2hA6oPbGyRRfU+7N6GW9TMb6QLicz0wDONmyCUsBK9kMkaQQIsMfBXXdJ8EulVmk=\.eyJUeXBlIjoiTWVya2xlUHJvb2YiLCJNZXJrbGVSb290IjoiODQzNWJjMzkzZDRiOTU0OGQwMmExNGQ3NzBiNTMyYjI1YzNhYzAwYTMwOWUwNzU4ODMyMTc4M2Q2MmRmYmIzZiIsIlR4bkhhc2giOiI3N2I1YWZjMzBjYmZlYmU2OWU4MGQxZjZmNjQwYTZjM2ZkNGRjODNiNTY0YmJiZmRhYTY4MTA4Y2FmYWQ5YmQ3IiwiQmxvY2tIZWlnaHQiOjEzMzgyNjk1LCJOb2RlcyI6W3siVGFyZ2V0SGFzaCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiNzdjNWRiZmJjYTI3Y2NkZWNlNzY1ZWMwNTgzNmM1NjFhNTcxZjAxOGJmZGVlZDc4YjdkMmFlZWNkMDk4MDdhZSIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiJlMTQxNzJjOGE2ZTE5Mzk0MzQ2NTY0OGUxYzU4NmE5MTg2YTM3ODRlZTdlZTI5ZGI5ZWRiZjZhZmUwNGY1MzkwIiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6IjY1MzZlZTViY2IzYzQwMjM2ZGY3NTE0MmU4MDI5ODQxODAwN2Q4YzIxNGIwOGYyYWM3YjVlNmYwMWE3MWJhMTkiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiOGY4NTRjMTRhYjQyMmVmOWRlZmJhZWJmNTViOGJmOTNkM2VlMDYxMGYwNjExMTVjYjg1OTk0MzhlMjQ4NWMwNyIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiJkYmI4MTFhZmJmMmI3NWI3Y2M5YTE5MTg5NzRmN2Q1NjhkYWI4MzJjNTI3ZmI5Mjc1NjAwYWM0ZTkyYzQwN2Y5IiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6IjZiZmM0NWFiNjc5Nzc0ZjhkNDFjM2IwOGM0NDY0YTRhMzkxYjczNjZjZDEwMTkxZWYyMjJmNDkwMTc3N2ZhYzYiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiZjYxNjIwNzk0Yjg5OTYxZmQ3NzA5NTNlYjFkYWZkM2QyNjdlODFlN2Q3NmMxZjc1MjgwNDMyMTBlN2M4ODAzYyIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiIzZTBhOWM2MzU1ZGM1YjM5ZDE5NGIwNDliMWQ4YmIyMzM1Y2I5NzMzMWUxNDQ3YzkzYWYzYWNiODE4NmY1YjQ4IiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6IjM1MjYzMzRhYmQ3NzBkOTIxMWQ5Y2I1Y2RlYzAyY2JlMTZlMTFjOTcwYWRkZjkyODdhYWFmNmMxYTIwMjBiZTciLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiOGVlMGRhMzZmOTE4YTEzM2VjZDJiNjFiZDRkN2FjMmQ2NTYxZjA4YWFiZTFlNjQ5ZTFiOTExMGJlYTdkNjQ3NSIsIkRpcmVjdGlvbiI6IkxlZnQifV0sIkNvbnRyYWN0QWRkciI6IjM2YmI1YzA1M2I2YjgzOWM4ZjZiOTIzZmU4NTJmOTEyMzliOWZjY2MifQ=='
    let a = Claim.deserialize(str)
    console.log('a', a)
  })
  test("test decode message", async () => {
    let str = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDpvbnQ6QVBjOEZCZEdZZHpEdFdyRnA4cTJCU1VGWDJIQW5CdUJuYSNrZXlzLTEiLCJ0eXAiOiJKV1QifQ==.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJleHAiOjE2NTM2MjIwNjcsIm5iZiI6MTYyMjA4NjA2NywiaWF0IjoxNjIyMDg2MDY3LCJqdGkiOiJ1cm46dXVpZDo5ZGFhYmNkYi1jYTI2LTRjODYtODQyNS1kNGRkMjQ1YzI4YmYiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vb250aWQub250LmlvL2NyZWRlbnRpYWxzL3YxIiwiY3JlZGVudGlhbDpzZnBfcGFzc3BvcnRfYXV0aGVudGljYXRpb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJOYW1lIjoiSFNVQU4gWUFORyIsIkJpcnRoRGF5IjoiMTk5NC0wMy0wOSIsIkV4cGlyYXRpb25EYXRlIjoiMjAyMi0wMy0xMiIsIklERG9jTnVtYmVyIjoiRU0yNjAzODYiLCJJc3N1ZXJOYW1lIjoiU2h1ZnRpcHJvIiwidXNlcl9kaWQiOiJkaWQ6b250OjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJpZCI6IjRmN2YxNTlhYzRiOTkxM2JiMTg1ZmRmMTg5NTcwNWY2MWI3ZDBjYzYiLCJ0eXBlIjoiQXR0ZXN0Q29udHJhY3QifSwicHJvb2YiOnsiY3JlYXRlZCI6IjIwMjEtMDUtMjdUMDM6Mjc6NDdaIiwicHJvb2ZQdXJwb3NlIjoiYXNzZXJ0aW9uTWV0aG9kIn19fQ==.AbHL+YiTNeBncr85G7uQFKGZGtmv/hHuNxK2PurjtvYxpqQkSggWDIZaa1B2JVrhjlSI8U6tBTBr/ZmGtfTGZnc=\\.eyJUeXBlIjoiTWVya2xlUHJvb2YiLCJNZXJrbGVSb290IjoiZDA5N2VmNDk1YWMyZmNmMGFiOTNlOGQ5OTQ3ZTgzMjZkOTA0MzNkNzAwN2VhNTIwMzk0ZjQ3NjhkN2VlN2U2OSIsIlR4bkhhc2giOiI4ZTQ0ZjI2YWUzOGFjNDU3OTZiMTc3ZjVjZTFhYTExYTcwZjE0ZDJhNzQ5YjlmYzFmNWI4ZmNjZDlkMTkyYWQzIiwiQmxvY2tIZWlnaHQiOjE2MDIyNjAyLCJOb2RlcyI6W3siVGFyZ2V0SGFzaCI6Ijc3YzVkYmZiY2EyN2NjZGVjZTc2NWVjMDU4MzZjNTYxYTU3MWYwMThiZmRlZWQ3OGI3ZDJhZWVjZDA5ODA3YWUiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiNDBmZWM3NDFlYjc4NmI1ZjI5YmI3YTY0ZjAxMTlmYmRiZjEwOGY3YjJhYTU2ODc0YmMzODcyMWQ4NzkzNGRjNSIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiIwMjZkOGI4OTI0MWNhOTAyMjMzODY4MmI3YWM0NzBiNzk5YTg4M2NlMTUwOTE1ZGEzZjVkNTdiZDhmOGFkZjg5IiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6IjcwNmI5OTU1OTY3ZDdkNDBkOWE4ZjYyMzcxNDE5NjAzMDAzOTAyY2FjOTNkYTAyZGQzM2I1Y2U1YWYxNmQyZWYiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiOTg4YmIzMDM1YTliZGNmMzI5NWQ2YTMzMjY4NDNkNTM5NDUxZjg3Yjk1MmI0ZjI2ZTM3NDc3NDJlNjgyODYyMCIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiJhMTlkYzFlZGJlNTk0YWY0ODE4ODU1ODBiZDE2NWRhMGQ3MzU2YzdiYjMzYjA5NjQxZWY4OTBmNGY4NThlMmFiIiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6ImJlNjNlODhhZDRjODYwZDg3MjhmZTBhODliNDQxMjg0MzRkNmI3MjEyMTI5MTA4YzlhYzBmODhlMzMwNDFhZDUiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiNzk3NWEyOTA3YzJmN2ZmZTgzZDUzMWMxOGExNWU3ZWI0MWFjNDE1NjM4YzA0NzEzZDNhNGY4MTI1YTAxYzc2OSIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiI2ZTEyZjdhMTM1ZjgxMDVlZjZlODQzNzAwOTE0MzI4YmEyNjBhZDFkYzcwZDFhOTMyYzA1YmEwMzA2OWYyZDdkIiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6IjlhNDQzM2RhODUyMjlhZGI0ZjI5N2NmMDFiZTZhNTU0Y2FmMjg3NGVlZmE3NjlkMjY0MTk5NGQ3YjYxNzk4M2EiLCJEaXJlY3Rpb24iOiJMZWZ0In0seyJUYXJnZXRIYXNoIjoiNTY0NzYxNGIwZjEzNTVlZjc0MWFkZTc1OTRmMmZhNTQ5NWY0MmI0NGVjYzZlNDgyZDU5ZTA2MTg5MjJkY2Q0NiIsIkRpcmVjdGlvbiI6IkxlZnQifSx7IlRhcmdldEhhc2giOiIzNTI2MzM0YWJkNzcwZDkyMTFkOWNiNWNkZWMwMmNiZTE2ZTExYzk3MGFkZGY5Mjg3YWFhZjZjMWEyMDIwYmU3IiwiRGlyZWN0aW9uIjoiTGVmdCJ9LHsiVGFyZ2V0SGFzaCI6IjhlZTBkYTM2ZjkxOGExMzNlY2QyYjYxYmQ0ZDdhYzJkNjU2MWYwOGFhYmUxZTY0OWUxYjkxMTBiZWE3ZDY0NzUiLCJEaXJlY3Rpb24iOiJMZWZ0In1dLCJDb250cmFjdEFkZHIiOiIzNmJiNWMwNTNiNmI4MzljOGY2YjkyM2ZlODUyZjkxMjM5YjlmY2NjIn0=';
    let arr = str.split('.');
    console.log('arr', arr);
    arr.map(item => {
      const result = Base64Decode(item);
      console.log('result', result)
    })
  })
  test("test deserialize str", async () => {
    let str = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDpvbnQ6QVBjOEZCZEdZZHpEdFdyRnA4cTJCU1VGWDJIQW5CdUJuYSNrZXlzLTEiLCJ0eXAiOiJKV1QifQ==.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJleHAiOjE2NTQ5Mzc5NTQsIm5iZiI6MTYyMzQwMTk1NCwiaWF0IjoxNjIzNDAxOTU0LCJqdGkiOiJ1cm46dXVpZDpmOTQ5YjgzOC0xZTkxLTQ4OGUtODE3OS03MWMyMzUzMzUyMjEiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vb250aWQub250LmlvL2NyZWRlbnRpYWxzL3YxIiwiY3JlZGVudGlhbDpzZnBfcGFzc3BvcnRfYXV0aGVudGljYXRpb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJOYW1lIjoiSFNVQU4gWUFORyIsIkJpcnRoRGF5IjoiMTk5NC0wMy0wOSIsIkV4cGlyYXRpb25EYXRlIjoiMjAyMi0wMy0xMiIsIklERG9jTnVtYmVyIjoiRU0yNjAzODYiLCJJc3N1ZXJOYW1lIjoiU2h1ZnRpcHJvIiwidXNlcl9kaWQiOiJkaWQ6ZXRoOjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJpZCI6IjRmN2YxNTlhYzRiOTkxM2JiMTg1ZmRmMTg5NTcwNWY2MWI3ZDBjYzYiLCJ0eXBlIjoiQXR0ZXN0Q29udHJhY3QifSwicHJvb2YiOnsiY3JlYXRlZCI6IjIwMjEtMDYtMTFUMDg6NTk6MTRaIiwicHJvb2ZQdXJwb3NlIjoiYXNzZXJ0aW9uTWV0aG9kIn19fQ==.AYHe4xhgFCdx2Npkm7ejBPZM2SeyRd3pIFe24MpozZKVi0ZY7HVr1+GolvdhnAwlzmpjxken0GcJVh410x/PTjI=';
    let arr = deserialize(str);
    console.log('arr', arr);
  })
  test("test serializeSignMessage str", async () => {
    let jwtStr = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDpvbnQ6QVBjOEZCZEdZZHpEdFdyRnA4cTJCU1VGWDJIQW5CdUJuYSNrZXlzLTEiLCJ0eXAiOiJKV1QifQ==.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJleHAiOjE2NTQ5NDE5MjksIm5iZiI6MTYyMzQwNTkyOSwiaWF0IjoxNjIzNDA1OTI5LCJqdGkiOiJ1cm46dXVpZDphOGEzYjQ2Yi00ZmQ0LTQ4MmQtOTlhMy03OTg5MTdiYzk3MDQiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vb250aWQub250LmlvL2NyZWRlbnRpYWxzL3YxIiwiY3JlZGVudGlhbDpzZnBfcGFzc3BvcnRfYXV0aGVudGljYXRpb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJOYW1lIjoiSFNVQU4gWUFORyIsIkJpcnRoRGF5IjoiMTk5NC0wMy0wOSIsIkV4cGlyYXRpb25EYXRlIjoiMjAyMi0wMy0xMiIsIklERG9jTnVtYmVyIjoiRU0yNjAzODYiLCJJc3N1ZXJOYW1lIjoiU2h1ZnRpcHJvIiwidXNlcl9kaWQiOiJkaWQ6ZXRoOjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJpZCI6IjY1ZDM1NzdjZWVmZTBlNjgwMDVmZmEzNTA1NjhjNzUyYTgyMjllNjAiLCJ0eXBlIjoiQXR0ZXN0Q29udHJhY3QifSwicHJvb2YiOnsiY3JlYXRlZCI6IjIwMjEtMDYtMTFUMTA6MDU6MjlaIiwicHJvb2ZQdXJwb3NlIjoiYXNzZXJ0aW9uTWV0aG9kIn19fQ==.Ac/7tyOuhCEtYzEg/In6VYCpHmhiCzizvCNsgW9R3HyBJI/S9jK74xvuddL+tNQo5GRLQORBsYq0Gqv0OrLzV0Y='
    const ownerDid = generateId('0x5c7b386B2B8779304E701CbBE22a53671446629b', chainType.ETH);
    const signMessage: signMessageType = {
      jwtStr,
      audienceId: 'did:ont:AUokgZN93vGemHootneWfuhogShVZCz6nX',
      ownerDid,
      effectiveTime: 2592000
    }
    const result = serializeSignMessage(signMessage);
    console.log('result', result);
  })
  test("test createPresentation", async () => {
    let originMessage = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpldGg6NWM3YjM4NkIyQjg3NzkzMDRFNzAxQ2JCRTIyYTUzNjcxNDQ2NjI5YiNrZXlzLTEifQ.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJqdGkiOiJkaWQ6ZXRoOjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIiLCJhdWQiOiJkaWQ6b250OkFVb2tnWk45M3ZHZW1Ib290bmVXZnVob2dTaFZaQ3o2blgiLCJuYmYiOjE2MjM0MTEwMjk5MTUsImlhdCI6MTYyMzQxMTAyOTkxNSwiZXhwIjoxNjIzNDEzNjIxOTE1LCJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWxzIjpbImV5SmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwdmJuUTZRVkJqT0VaQ1pFZFpaSHBFZEZkeVJuQTRjVEpDVTFWR1dESklRVzVDZFVKdVlTTnJaWGx6TFRFaUxDSjBlWEFpT2lKS1YxUWlmUT09LmV5SnBjM01pT2lKa2FXUTZiMjUwT2tGUVl6aEdRbVJIV1dSNlJIUlhja1p3T0hFeVFsTlZSbGd5U0VGdVFuVkNibUVpTENKbGVIQWlPakUyTlRRNU5ERTVNamtzSW01aVppSTZNVFl5TXpRd05Ua3lPU3dpYVdGMElqb3hOakl6TkRBMU9USTVMQ0pxZEdraU9pSjFjbTQ2ZFhWcFpEcGhPR0V6WWpRMllpMDBabVEwTFRRNE1tUXRPVGxoTXkwM09UZzVNVGRpWXprM01EUWlMQ0oyWXlJNmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNJc0ltaDBkSEJ6T2k4dmIyNTBhV1F1YjI1MExtbHZMMk55WldSbGJuUnBZV3h6TDNZeElpd2lZM0psWkdWdWRHbGhiRHB6Wm5CZmNHRnpjM0J2Y25SZllYVjBhR1Z1ZEdsallYUnBiMjRpWFN3aWRIbHdaU0k2V3lKV1pYSnBabWxoWW14bFEzSmxaR1Z1ZEdsaGJDSmRMQ0pqY21Wa1pXNTBhV0ZzVTNWaWFtVmpkQ0k2ZXlKT1lXMWxJam9pU0ZOVlFVNGdXVUZPUnlJc0lrSnBjblJvUkdGNUlqb2lNVGs1TkMwd015MHdPU0lzSWtWNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1pMHdNeTB4TWlJc0lrbEVSRzlqVG5WdFltVnlJam9pUlUweU5qQXpPRFlpTENKSmMzTjFaWEpPWVcxbElqb2lVMmgxWm5ScGNISnZJaXdpZFhObGNsOWthV1FpT2lKa2FXUTZaWFJvT2pWak4ySXpPRFpDTWtJNE56YzVNekEwUlRjd01VTmlRa1V5TW1FMU16WTNNVFEwTmpZeU9XSWlmU3dpWTNKbFpHVnVkR2xoYkZOMFlYUjFjeUk2ZXlKcFpDSTZJalkxWkRNMU56ZGpaV1ZtWlRCbE5qZ3dNRFZtWm1Fek5UQTFOamhqTnpVeVlUZ3lNamxsTmpBaUxDSjBlWEJsSWpvaVFYUjBaWE4wUTI5dWRISmhZM1FpZlN3aWNISnZiMllpT25zaVkzSmxZWFJsWkNJNklqSXdNakV0TURZdE1URlVNVEE2TURVNk1qbGFJaXdpY0hKdmIyWlFkWEp3YjNObElqb2lZWE56WlhKMGFXOXVUV1YwYUc5a0luMTlmUT09LkFjLzd0eU91aENFdFl6RWcvSW42VllDcEhtaGlDeml6dkNOc2dXOVIzSHlCSkkvUzlqSzc0eHZ1ZGRMK3ROUW81R1JMUU9SQnNZcTBHcXYwT3JMelYwWT0iXX19';
    let signature = '0x1872e988f938d19ab76d880162ea6ae529d0382f8a86a65b7654657ad9182db924de55303326e30bc1fe212fd2cd46084ed4f33f6218fce3779cc3f6cbfe10751b';
    let presentation = createPresentation({
      originMessage,
      signature
    });
    console.log('presentation', presentation);
  })
})

describe("test moment", () => {
  test("test moment fn", () => {
    let a = moment(Date.now() + 2592000).format()
    console.log('moment', a);
    let b = new Date('Sun Jan 01 2023 00:00:00 GMT+0800 (中国标准时间)');
    console.log('moment b', b);
    let c = Date.now() + 2592000;
    console.log('Date.now()', Date.now());
    console.log('c', c);
  })
})

describe("test Credentials", () => {
  test("test Credentials fn", () => {
    // console.log('Credentials', Credentials);
    const ownerDid = generateId('0x5c7b386B2B8779304E701CbBE22a53671446629b', chainType.ETH);
    let a = new Credentials.JwtHeader(Crypto.SignatureScheme.ECDSAwithSHA256.labelJWS, ownerDid + '#keys-1');
    let b = a.serialize(Crypto.SignatureScheme.ECDSAwithSHA256, ownerDid + '#keys-1');
    console.log('a', a);
    console.log('b', b);
  })
})


describe("make presentation", () => {
  test("presentation fn", async () => {
    // const web3 = new Web3(Web3.givenProvider);
    const adminPrivateKey = new Crypto.PrivateKey("1f70a6f8b118e3cab9dc23f879c7bb7ff4bfbd7b611b03c758e1f45e7cd9583b")

    // const ownerDid = generateId('0xCb45c3C4b6ED950070E6F90aA5381bdBD07D98CD', chainType.ETH);
    // did:ont:AcFNy7vYUu8acN7c5tXPZZPbVE6r1JTh7
    const ownerDid = "did:ont:AcFNy7vYUu8acN7c5tXPZZPbVE6r1JTh7";
    let encryptOriginData = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDpvbnQ6QVBjOEZCZEdZZHpEdFdyRnA4cTJCU1VGWDJIQW5CdUJuYSNrZXlzLTEiLCJ0eXAiOiJKV1QifQ==.eyJpc3MiOiJkaWQ6b250OkFQYzhGQmRHWWR6RHRXckZwOHEyQlNVRlgySEFuQnVCbmEiLCJleHAiOjE2NTQ5NDE5MjksIm5iZiI6MTYyMzQwNTkyOSwiaWF0IjoxNjIzNDA1OTI5LCJqdGkiOiJ1cm46dXVpZDphOGEzYjQ2Yi00ZmQ0LTQ4MmQtOTlhMy03OTg5MTdiYzk3MDQiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vb250aWQub250LmlvL2NyZWRlbnRpYWxzL3YxIiwiY3JlZGVudGlhbDpzZnBfcGFzc3BvcnRfYXV0aGVudGljYXRpb24iXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJOYW1lIjoiSFNVQU4gWUFORyIsIkJpcnRoRGF5IjoiMTk5NC0wMy0wOSIsIkV4cGlyYXRpb25EYXRlIjoiMjAyMi0wMy0xMiIsIklERG9jTnVtYmVyIjoiRU0yNjAzODYiLCJJc3N1ZXJOYW1lIjoiU2h1ZnRpcHJvIiwidXNlcl9kaWQiOiJkaWQ6ZXRoOjVjN2IzODZCMkI4Nzc5MzA0RTcwMUNiQkUyMmE1MzY3MTQ0NjYyOWIifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJpZCI6IjY1ZDM1NzdjZWVmZTBlNjgwMDVmZmEzNTA1NjhjNzUyYTgyMjllNjAiLCJ0eXBlIjoiQXR0ZXN0Q29udHJhY3QifSwicHJvb2YiOnsiY3JlYXRlZCI6IjIwMjEtMDYtMTFUMTA6MDU6MjlaIiwicHJvb2ZQdXJwb3NlIjoiYXNzZXJ0aW9uTWV0aG9kIn19fQ==.Ac/7tyOuhCEtYzEg/In6VYCpHmhiCzizvCNsgW9R3HyBJI/S9jK74xvuddL+tNQo5GRLQORBsYq0Gqv0OrLzV0Y='
    const serializeMessage: signMessageType = {
      jwtStr: encryptOriginData,
      audienceId: 'did:ont:AUokgZN93vGemHootneWfuhogShVZCz6nX',
      ownerDid,
      effectiveTime: 2592000
    }
    const originMessage = serializeSignMessage(serializeMessage);
    console.log('originMessage', originMessage);
    // const { signature } = await web3.eth.accounts.sign(originMessage, '57aa4b1fa4f1bc6824d8ed3cea202b4753e0734ccd94a4a7ba941a3f46739cce');

    const sig = adminPrivateKey.sign(originMessage)

    console.log('signature', sig.serializeHex());
    let presentation = createPresentation({
      originMessage,
      signature: sig.serializeHex()
    });
    console.log('presentation', presentation);
  })
})

describe("SocialAuth", () => {
  test("getSocialAuthLink", () => {
    const accountId = generateId('0x5c7b386B2B87793a467018bBE22a53678446629b', chainType.ETH);
    console.log('link: ', getSocialAuthLink(accountId, AuthType.Discord, '521113c1-9e5b-4d00-b137-c91ecad424ff', 'test001'))
  })
})

describe("test Ontology sign message", () => {
  test("test Ontology sign message fn", () => {
    console.log('Credentials', Crypto.PrivateKey);
    const adminPrivateKey = new Crypto.PrivateKey("1f70a6f8b118e3cab9dc23f879c7bb7ff4bfbd7b611b03c758e1f45e7cd9583b")
    const sig = adminPrivateKey.sign('11111')
    console.log("sign", {
      sign: sig.serializeHex()
    })
  })
})
