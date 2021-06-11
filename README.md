# @ericyangchen/npmyangtest



#### 安装

```node
// 插件名称待定
npm i xxx

yarn add xxx
```



Using `import` to include the modules from `xxx`:

```javascript
import VC from xxx;

var areaList = VC.utils.areaList
```



#### Require

Using `require` to include the modules from `xxx`:

```javascript
var VC = require(xxx);
var areaList = VC.utils.areaList
```

#### In the Browser

To use in the browser you must use the compiled version (as listed above). The `browser.js` file is located in the `lib` directory. Include it into the project with a `<script>` tag:

```html
<script src="./lib/browser.js"></script>
```

Everything will be available under the `VC` variable, just like in the `require` example above.

```javascript
var areaList = VC.utils.areaList
```



#### 使用

##### 发送验证信息

```javascript
import VC from 'xxxx'

/***
params
{
  appId: string,
  backDoc: string,
  country: string,
  docId: string,
  docType: string,
  frontDoc: string,
  name: string,
  ownerDid: string,  sdk 方法生成
}
**/

await VC.sendUserInfo({...params}, apiKey)

/***
returnType 
成功发送 return true
异常 Throw error message
***/
```



##### 获取用户 `credential`

```javascript
import VC from 'xxxx'

/**
params
ownerDid: string,  sdk 方法生成
docType: string 证件类型
**/

const result = await VC.getVcList(ownerDid, docType);

/**
return 
{
      authId: '0348xxxx-xxxx-4317-xxxx-8d6f6166a65b',
      appId: 'tesxxxx01',
      credentialContext: 'credential:sfp_passport_authentication',
      description: 'My Shuftipro Passport Authentication',
      txHash: '9494568336a4c2xxxxxxxxxxxxxxxxbaa066e1585fe47',
      status: 1,
      encryptOriginData: 'xxxxxxx', // credential 主要信息
      requestTime: 1622156645
    }
    
    status
    1 ---- 成功
    2 ---- 验证失败
    0 ---- 验证中
**/
```



#### `utils` 方法

##### `areaList`

```javascript
import VC from 'xxxx'

VC.utils.areaList

/**
return array

[
  { name: 'Afghanistan', alias: 'AF' },
  { name: 'Aland Islands', alias: 'AX' },
  ...
]

name ----- country name
alias ---- abbreviation, 用户选择的 country value

**/

```

##### `docType`

```javascript
import VC from 'xxxx'

VC.utils.docType

/**
return object

{
  Passport: 'passport',
  IdCard: 'id_card',
  DrivingLicense: 'driving_license'
}

**/

```



##### `chainType`

```javascript
import VC from 'xxxx'

VC.utils.chainType

/**
return object

{
  ETH: 'eth',
  BSC: 'bnb'
}

**/

```


`generateId`

```javascript
import VC from 'xxxx'

/**
params
ETH Address
**/
const ownerDid = VC.utils.generateId('0xaaaaaaaaaaaaa', chainType);

/**
return 
did string
**/
```



`deserialize`

```javascript
import VC from 'xxxx'

/**
params
encryptOriginData of credential result
base64 hash string
**/
const result = VC.utils.deserialize(string)


/**
return type

{
      '@context': [
        'https://www.w3.org/20xxxxxxxxxxxx',
        'https://ontid.ont.i20xxxxxxxxxxxx',
        'credential:sfp_passport_authentication'
      ],
      id: 'urn:uuid:861cbae4-xxxx-4844-xxxx-8c8xxxx7052',
      type: [ 'VerifiableCredential' ],
      issuer: 'did:ont:APc8FBxxxxxxxxxxxxxxSUFX2HAnBuBna',
      issuanceDate: '2021-05-28T07:04:23.000Z',
      expirationDate: '2022-05-28T07:04:23.000Z',
      credentialStatus: {
        id: '4f7f159ac4xxxxxxxxxxx5f61b7d0cc6',
        type: 'AttestContract'
      },
      credentialSubject: {
        Name: 'xxxxxxxx',
        BirthDay: 'xxxx-03-09',
        ExpirationDate: 'xxxx-03-12',
        IDDocNumber: 'xx26xxxx86',
        IssuerName: 'Shxxxxro',
        user_did: 'did:ont:5cxxxxxxxx701CbBExxxxx29b'
      },
      proof: {
        type: 'JWT',
        verificationMethod: 'did:ont:APcxxxxxxxxq2BSUFX2xxxxxna#keys-1',
        created: '2021-05-28T07:04:23Z',
        proofPurpose: 'assertionMethod',
        jws: 'ARyjxxxxxxxxxxxxxxxxxxGDisGMJdFE/4erXIazh3n8ipPotTFA+Z4hS09GlhVaio=\\'
      }
    }

**/
```

`serializeSignMessage`

```javascript

import VC from 'xxxx'

/**
params
{
  jwtStr: string, // jwt
  audienceId: string, // pro Id
  ownerDid: string    // user wallet address
  effectiveTime: number   // Presentation Effective time, eg 1 day = 86400
}
**/
const JWT = VC.utils.serializeSignMessage(params);

/**
return 
jwt string
**/
```

`createPresentation`

```javascript

import VC from 'xxxx'

/**
params
{
  signMessage: string  //  Signed metadata
  signature: string    //  Signature after signing through metamask
}
**/
const JWT = VC.utils.createPresentation(params);

/**
return 
presentation jwt string
**/
```
