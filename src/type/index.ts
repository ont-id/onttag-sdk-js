export interface ApiResponse<Result> {
  error: number;
  desc: string;
  result: Result;
}

export interface ApiAllVcResult {
  list: Object[];
}

export interface SendUserInfo {
  appId: string,
  backDoc: string,
  country:  string,
  docId: string,
  docType: string,
  frontDoc: string,
  name: string,
  ownerDid: string,
}

export enum DocType {
  Passport= 'passport',
  IdCard = 'id_card',
  DrivingLicense = 'driving_license'
}

export enum CredentialContextType {
  passport = 'credential:sfp_passport_authentication',
  id_card = 'credential:sfp_idcard_authentication',
  driving_license = 'credential:sfp_dl_authentication'
}
