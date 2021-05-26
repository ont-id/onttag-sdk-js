import { CredentialContextType, SendUserInfo } from '../type/index';
import { SortParams, SHA256, ConnectStr } from "../utils";
import { AxiosResponse } from "axios";
import { ApiResponse, ApiAllVcResult } from '../type';
import request from "./request";

export const getVcList = async (ontid: string = ''): Promise<any> => {
  const { data }: AxiosResponse<ApiResponse<ApiAllVcResult>> = await request({
    url: '',
    method: 'POST',
    data: {
      ontid
    }
  })
  if (data.error !== 0) {
    throw new Error(data.desc)
  }
  return data.result.list
}

export const sendUserInfo = async (params: SendUserInfo, apiKey: string): Promise<boolean> => {
  let credentialContext = '';
  Object.getOwnPropertyNames(CredentialContextType).forEach(function (key) {
    if (key === params.docType) {
      // @ts-ignore
      credentialContext = CredentialContextType[key]
    }
  });
  const originParams = {
    ...params,
    credentialContext,
    encryptFlag: false,
    isLivingDetection: false,
  }
  const customParams = SortParams(originParams);
  let str = ConnectStr(customParams);
  let sign = SHA256(str + apiKey);
  console.log('params', JSON.stringify({
    ...customParams,
    sign
  }))
  try {
    const { data }: AxiosResponse<ApiResponse<string>> = await request({
      url: '/v1/kyc-data',
      method: 'POST',
      data: {
        ...customParams,
        sign
      }
    })
    console.log('data', data);
    if (data.error !== 0) {
      throw new Error(data.desc)
    }
    return true;
  } catch (e) {
    console.log(JSON.stringify(e))
    throw new Error(e)
  }
}
