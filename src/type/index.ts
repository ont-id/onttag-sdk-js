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
  region: string,
  docId: string,
  docType: string,
  frontDoc: string,
  name: string,
  ownerDid: string,
}

export enum DocType {
  Passport = 'passport',
  IdCard = 'id_card',
  DrivingLicense = 'driving_license',
  Twitter = 'twitter',
  Github = 'github',
  Linked = 'linked',
  Line = 'line',
  Amzon = 'amzon',
  Kakao = 'kakao'
}

export enum chainType {
  ETH = 'etho',
  BSC = 'bnb'
}
export enum CredentialContextType {
  passport = 'credential:sfp_passport_authentication',
  id_card = 'credential:sfp_idcard_authentication',
  driving_license = 'credential:sfp_dl_authentication',
  twitter = 'credential:twitter_authentication',
  github = 'credential:github_authentication',
  linked = 'credential:linkedin_authentication',
  line = 'credential:line_authentication',
  amzon = 'credential:amazon_authentication',
  kakao = 'credential:kakao_authentication'
}

export interface proofType {
  type: string,
  created: string,
  proofPurpose: string,
  verificationMethod: string,
  jws: string
}

export interface headerType { alg: string, kid: string, typ: string }

export interface bodyType {
  iss: string,
  exp: number,
  nbf: number,
  iat: number,
  jti: string,
  vc: {
    "@context": Array<string>,
    type: Array<string>,
    credentialSubject: object,
    credentialStatus: object,
    proof: {
      created: string,
      proofPurpose: string
    }
  }
}

export interface credentialType {
  "@context": Array<string>,
  id: string,
  type: Array<string>,
  issuer: string,
  issuanceDate: string,
  expirationDate: string,
  credentialSubject: object,
  credentialStatus: object,
  proof: proofType
}

export interface signMessageType {
  jwtStr: string,
  audienceId: string,
  ownerDid: string,
  effectiveTime: number
}

export interface createPresentationType {
  originMessage: string,
  signature: string
}
