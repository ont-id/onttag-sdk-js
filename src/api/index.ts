import { CredentialContextType, SendUserInfo } from '../type/index';
import { HmacSHA256, SortParams, SHA256, ConnectStr } from "../utils";
// import { AxiosResponse } from "axios";
// import { ApiResponse, ApiAllVcResult } from '../type';
// export const getVcList = async (ontid: string = ''): Promise<any> => {
//   const { data }: AxiosResponse<ApiResponse<ApiAllVcResult>> = await request({
//     url: '',
//     method: 'POST',
//     data: {
//       ontid
//     }
//   })
//   if (data.Error) {
//     throw new Error(data.Desc)
//   }
//   return data.Result.list
// }

export const sendUserInfo = async (params: SendUserInfo, apiKey: string): Promise<any> => {
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
  return {
    ...customParams,
    sign
  }
  // const result = await request({
  //   url: '',
  //   method: 'POST',
  //   data: {
  //
  //   }
  // })
}
