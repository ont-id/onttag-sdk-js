[ [English](https://github.com/ontology-tech/ont-tag-ts-sdk/blob/master/README.md) | 中文 ]

# DID 可验证声明验证服务对接

## 安装

```js
npm i @ont-dev/ont-tag
```

## 导入

```js
import VC from "@ont-dev/ont-tag";
```

下面的 `require` 语句也可以用于加载模块。

```js
var VC = require("@ont-dev/ont-tag");
```

在浏览器中使用包中的方法时需要使用编译后的库。`browser.js` 文件在 `lib` 目录下：

```js
<script src="./lib/browser.js"></script>
```

现在所有内容可以通过 `VC` 变量名来访问。例如，获取支持地区列表的方式如下：

```js
var areaList = VC.utils.areaList;
```

## 使用

### 方法列表

| 方法名                                              | 描述                                           |
| --------------------------------------------------- | ---------------------------------------------- |
| [sendUserInfo](#发送身份认证请求)                   | 向信任锚服务发送身份认证请求和用户的 KYC 信息  |
| [getSocialAuthLink](#获取第三方认证链接)              | 获取用于社交平台认证的 URL              |
| [getVcList](#获取凭证)                        | 为已发送的身份认证请求获取相应的凭证       |
| [utils.areaList](#arealist)                         | 返回支持的国家和地区及其相应的代号             |
| [utils.authType](#authtype)                           | 返回有效的身份认证类型                        |
| [utils.chainType](#chaintype)                       | 返回支持的区块链                               |
| [utils.generateId](#generateid)                     | 用钱包地址生成对应的 ONT ID                    |
| [utils.serializeSignMessage](#serializesignmessage) | 序列化传入的对象数据并生成 `base64` 编码字符串 |
| [utils.createPresentation](#createpresentation)     | 用传入的凭证数据的 payload 生成展示            |
| [utils.deserialize](#deserialize)                   | 将传入的 `base64` 编码字符串反序列化成对象     |

### 发送身份认证请求

本方法用于为用户 KYC 数据发送身份认证请求。需要传入两种参数。一种是包含 KYC 信息的对象，如下所示。另一种是 API key。

```js
params // 待传参数
{
  appId: string,    // Ontology 分配的应用 ID
  region: string,  // 国籍（地区代号）
  docId: string,    // 文件 ID 号码
  authType: string,  // 文件或认证类型
  frontDoc: string, // 所选文件第一页的图像（已编码）
  backDoc: string,  // 所选文件最后一页的图像（已编码）
  name: string,     // 和文件中一致的法定名称
  ownerDid: string  // 用户 DID，通过 utility 方法 generateId 生成
}
```

> **注意：** `frontDoc` 和 `backDoc` 图片需作为 `base64` 编码后生成的字符串传入。

`region` 字段对应地区的代号。通过 `utils` 方法 [`areaList`](#arealist) 可以获取国家及对应代号列表。

`ownerDid` 字段对应一个 ONT ID，可以通过 `utils` 方法 [`generateId`](#generateid) 生成。

`authType` 字段描述身份认证类型或所发文件类型。通过 [`authType`](#authtype) `utils` 方法可以获取有效文件列表。

使用用户信息和 API key 调用此方法来发送身份认证请求：

```js
await VC.sendUserInfo({ ...params }, apiKey);
```

如果请求发送成功则返回 `true`。如出现错误则返回错误消息。

| 错误消息               | 描述                   |
| :--------------------- | :--------------------- |
| SUCCESS                | 身份认证成功           |
| APP_NOT_FOUND          | 未找到传入的 `appId`   |
| REQUEST_LIMIT_EXCEEDED | 用户发送的请求超出配额 |
| SIG_VERIFY_FAILED      | API 签名无效           |
| INTERNAL_ERROR         | 出现内部错误           |

> **注意：** 每个应用（通过 appid 和 API key 一起识别）针对同一用户的同一个文件或认证方式（通过用户的 DID context 识别）只能发送 10 个请求。如果出现任何内部错误，请联系 Ontology 团队。

### 获取第三方认证链接

调用此方法会返回一个触发社交媒体平台用户身份认证的 URL。

```ts
getSocialAuthLink(ownerDid, authType, apiKey, appId);
```

需要传入四种参数：
- `ownerDid`: 用户的 DID
- `authType`: 认证方式（社交媒体）， [请见参考](#authtype)
- `apiKey`: 你的 API key
- `appId`: 你的 app ID

调用方法后，返回的 URL 会触发指定社交平台的 OAuth 身份认证。

```ts
url: string;
```

成功授权后会颁发凭证，可以证明一个社交媒体账户和对应的 DID 的关系。

### 获取凭证

发送身份认证请求后，可以通过本方法获取为用户颁发的凭证。

需要传入两种参数。用户（或者说凭证持有者）的 DID，以及 ID 文件的类型。 

```js
const result = await VC.getVcList(ownerDid, authType);
```

如果身份认证成功，`encryptOriginData` 字段会包含序列化后的凭证数据。

```js
{
  authId: '0348xxxx-xxxx-4317-xxxx-8d6f6166a65b',
  appId: 'tesxxxx01',
  credentialContext: 'credential:sfp_passport_authentication',
  description: 'My Shuftipro Passport Authentication',
  txHash: '9494568336a4c2xxxxxxxxxxxxxxxxbaa066e1585fe47',
  status: 1,
  encryptOriginData: 'xxxxxxx', // 凭证信息
  requestTime: 1622156645 // unix 时间戳 (以秒为单位)
}
```

| 状态 | 描述         |
| :----: | ------------ |
|   1    | 身份认证成功 |
|   2    | 身份认证失败 |
|   0    | 验证中       |

> **注意：** 用户需要通过签名授权数据的访问，证明他们同凭证数据之间的关系。获取凭证数据后，可以使用签名过的凭证数据生成展示的 payload。展示的 token 可以用于签名验证和访问控制。

### Utility 方法

`utils` 类中包含多种用于执行特定任务的方法。具体请见下列描述。

#### `areaList`

使用此方法可以得到所有支持的国家和地区以及相应代号构成的数组。

```js
VC.utils.areaList;
```

响应结构如下：

```js

[
  { name: 'Afghanistan', alias: 'AF' },
  { name: 'Aland Islands', alias: 'AX' },
  ...
]
```

#### `authType`

使用此方法可以返回所有支持的身份认证类型和文件类型，数据类型为对象。

```js
VC.utils.authType;
```

响应结构如下：

```js
{
  Passport: 'passport',
  IdCard: 'id_card',
  DrivingLicense: 'driving_license'
  Twitter: 'twitter',
  Github: 'github',
  Linkedin: 'linkedin',
  Line: 'line',
  Amazon: 'amazon',
  Kakao: 'kakao'
}
```

#### `chainType`

使用此方法可以得到包含有效区块链类型的对象。

```js
VC.utils.chainType;
```

响应结构如下：

```js
{
  ETH: 'etho',
  BSC: 'bnb'
}
```

#### `generateId`

调用这个方法需要传入钱包地址，并将 `chainType` 作为前缀传入相应的 DID 方法。有效的 ONT ID 会以字符串形式传回。例如：`did:etho:0xdc6...974a9`。

```js
const ownerDid = VC.utils.generateId("0xdc6...974a9", chainType);
```

#### `serializeSignMessage`

传入以下参数调用本方法可以返回通过 `base64` 序列化后的 JWT 字符串：

1. `jwtStr` - 凭证的 JWT 字符串
2. `audienceId` - 凭证使用者的 DID 
3. `ownerDid` - 凭证所有者的 DID 
4. `effectiveTime` - 展示有效时长（秒数），例如 1 天 = 86400 

参数的格式如下：

```js
{
  jwtStr: string,
  audienceId: string,
  ownerDid: string,
  effectiveTime: number   // 展示的有效时长，例如 1 天 = 86400
}
```

```js
const JWT = VC.utils.serializeSignMessage(params);
```

#### `createPresentation`

调用此方法生成展示需传入用户签名后的凭证数据，展示以 JWT 字符串的形式返回。

传入参数为对象，需要包含：

1. `signMessage` - 序列化的 JWT 字符串 （用 [`serializeSignMessage`](#serializesignmessage) 生成）
2. `signature` - 用户签名后的序列化 JWT 字符串

对象参数格式如下：

```javascript
{
  signMessage: string,
  signature: string
}
```

```js
const JWT = VC.utils.createPresentation(params);
```

展示数据可以通过将 token 反序列化获得。Java SDK 可以用来验证签名和消息解密。点击[此链接]()查看 reference 文档。

#### `deserialize`

通过[此方法](#获取颁发的凭证)获得凭证对象后，反序列化其中的 `encryptOriginData` 字符串可以获得用户验证过的 KYC 数据。

使用这个方法需传入序列化的 JWT 字符串，返回的对象中包含凭证数据。

```js
const result = VC.utils.deserialize(string);
```

响应的对象结构如下：

```js
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
```
