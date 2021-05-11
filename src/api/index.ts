import request from './request';
import { AxiosResponse } from "axios";
import { ApiResponse, ApiAllVcResult } from '../type';
export const getVcList = async (ontid: string = ''): Promise<any> => {
  const { data }: AxiosResponse<ApiResponse<ApiAllVcResult>> = await request({
    url: '',
    method: 'POST',
    data: {
      ontid
    }
  })
  if (data.Error) {
    throw new Error(data.Desc)
  }
  return data.Result.list
}
