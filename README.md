[ English | [中文](https://github.com/ontology-tech/ont-tag-ts-sdk/blob/master/README-cn.md) ]

# Verification via DID Verifiable Credentials Service Integration

## Installation

You can start with importing the `@ont-dev/ont-tag` package by running npm command below.

```js
npm i @ont-dev/ont-tag
```

You can now use the following `import` statement to bring in all the modules from the `@ont-dev/ont-tag` package.

```js
import VC from "@ont-dev/ont-tag";
```

The following `require` statement can also be used to load the modules.

```js
var VC = require("@ont-dev/ont-tag");
```

To use the methods in a browser, you must use the compiled version of the library. The `browser.js` file is located in the `lib` directory. You can include it in your project using a `script` tag as follows.

```js
<script src="./lib/browser.js"></script>
```

Everything will now be available under the `VC` variable. For instance, to fetch the list of available regions, you can invoke:

```js
var areaList = VC.utils.areaList;
```

## Usage

### Method list

| Method name                                                 | Description                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [sendUserInfo](#sending-an-authentication-request)          | Sends authentication request to the trust anchor service with user's KYC details |
| [getSocialAuthLink](#fetch-third-party-authentication-link) | Fetch URL to initiate social media platform authentication                       |
| [getVcList](#fetching-the-issued-credential)                | Fetches any issued credentials for previously sent authentication requests       |
| [utils.areaList](#arealist)                                 | Returns a list of countries and regions with their respective aliases            |
| [utils.authType](#authtype)                                 | Returns a list of valid authentication types                                     |
| [utils.chainType](#chaintype)                               | Returns the list of supported chains                                             |
| [utils.generateId](#generateid)                             | Generates a valid ONT ID using a wallet addresses                                |
| [utils.serializeSignMessage](#serializesignmessage)         | Serializes the passed object data to generate a `base64` string                  |
| [utils.createPresentation](#createpresentation)             | Generates a presentation for the passed credential data payload                  |
| [utils.deserialize](#deserialize)                           | Deserializes the passed `base64` string to an object                             |

### Sending an Authentication Request

This method is used to send authentication requests for a user's KYC data. It takes two parameters. The first one is an object literal with the KYC info. as defined below, and the second one is your API key.

```js
params // parameters to be passed
{
  appId: string,    // Application ID, assigned by Ontology
  region: string,  // Nationality (area alias)
  docId: string,    // Document ID no.
  authType: string,  // Document or authentication type
  frontDoc: string, // Front page image of the selected document (encoded)
  backDoc: string,  // Last page image of the selected document (encoded)
  name: string,     // Legal name as in document
  ownerDid: string  // DID of the user, generated using the generateId utility method
}
```

> **Note:** Both the `frontDoc` and `backDoc` images need to be passed as `base64` encoded strings.

The `region` field takes the respective alias for each region. Use the [`areaList`](#arealist) utility method to obtain the list of countries and their aliases.

The `ownerDid` field takes an ONT ID. You can generate one using the [`generateId`](#generateid) utility method.

The `authType` field specifies the type of document sent for authentication. Use the [`authType`](#authtype) utility method to fetch the list of valid documents.

Call the method with the user info and your API key to send an authentication request.

```js
await VC.sendUserInfo({ ...params }, apiKey);
```

It returns `true` for a successful request and an error message if an exception occurs.

| Error Message          | Description                       |
| :--------------------- | :-------------------------------- |
| SUCCESS                | Authentication successful         |
| APP_NOT_FOUND          | Passed `appId` not found          |
| REQUEST_LIMIT_EXCEEDED | Request limit for a user exceeded |
| SIG_VERIFY_FAILED      | Invalid API signature             |
| INTERNAL_ERROR         | Internal error occurred           |

> **Note:** Each application (identified with the combination of their appid and API key) is limited to sending 10 requests for a user's particular document/authentication method (identified with a user's DID context). Also, in case of an internal error, please get in touch with the Ontology team.

### Fetch Third Party Authentication Link

Invoking this method returns a URL that can be used to prompt user authentication for a social media platform.

```ts
getSocialAuthLink(ownerDid, authType, apiKey, appId);
```

It takes four parameters.

- `ownerDid`: User's DID
- `authType`: The authentication method (social media platform). [See here](#authtype)
- `apiKey`: Your API key
- `appId`: Your app ID

The method returns a URL that triggers OAuth authentication for a particular platform.

```ts
url: string;
```

Once successfully authorized, a credential will be issued that can be used to prove the relationship between a social media account and a DID.

### Fetching Credentials

You can use this method to fetch the issued credentials for a user after having sent a data authentication request.

This method takes two parameters, the DID of the user (or owner in the context of a credential), and the ID document type.

```js
const result = await VC.getVcList(ownerDid, authType);
```

If the authentication was successful, the `encryptOriginData` field will contain serialized credential data.

```js
{
  authId: '0348xxxx-xxxx-4317-xxxx-8d6f6166a65b',
  appId: 'tesxxxx01',
  credentialContext: 'credential:sfp_passport_authentication',
  description: 'My Shuftipro Passport Authentication',
  txHash: '9494568336a4c2xxxxxxxxxxxxxxxxbaa066e1585fe47',
  status: 1,
  encryptOriginData: 'xxxxxxx', // credential information
  requestTime: 1622156645 // unix timestamp (in seconds)
}
```

| Status | Description               |
| :----: | ------------------------- |
|   1    | Authentication successful |
|   2    | Authentication failed     |
|   0    | Verification in progress  |

> **Note:** The user needs to sign this data to authorize access and prove their relationship with the credential data. After fetching the credential data, you can proceed with generating a presentation with the signed credential data as its payload. The resultant token can then be used for signature verification and access control.

### Utility Methods

`utils` class contains multiple methods that can be used to perform specific tasks. Each method is described below.

#### `areaList`

Invoking this method returns an array of all the supported countries and regions with their respective aliases.

```js
VC.utils.areaList;
```

The response is structured as follows.

```js

[
  { name: 'Afghanistan', alias: 'AF' },
  { name: 'Aland Islands', alias: 'AX' },
  ...
]
```

#### `authType`

This method returns the list of supported documents and authentication types as an object.

```js
VC.utils.authType;
```

The response is of the following form.

```js
{
  Passport: 'passport',
  IdCard: 'id_card',
  DrivingLicense: 'driving_license',
  Twitter: 'twitter',
  Github: 'github',
  Linkedin: 'linkedin',
  Line: 'line',
  Amazon: 'amazon',
  Kakao: 'kakao'
}
```

#### `chainType`

This method returns an object containing valid chain type names.

```js
VC.utils.chainType;
```

The response is as follows.

```js
{
  ETH: 'etho',
  BSC: 'bnb'
}
```

#### `generateId`

Invoking this method with a wallet address prefixes it with the appropriate DID method based on the passed `chainType` and returns a valid ONT ID as a string. For e.g., `did:etho:0xdc6...974a9`.

```js
const ownerDid = VC.utils.generateId("0xdc6...974a9", chainType);
```

#### `serializeSignMessage`

This method returns a serialized `base64` JWT string. It takes the following parameters:

1. `jwtStr` - The credential JWT string
2. `audienceId` - DID of the credential consumer
3. `ownerDid` - DID of the Credential owner
4. `effectiveTime` - Validity period of the presentation (in seconds). For e.g., 1 day = 86400

The parameters are of the following form.

```js
{
  jwtStr: string,
  audienceId: string,
  ownerDid: string,
  effectiveTime: number   // Presentation Effective time, eg 1 day = 86400
}
```

```js
const JWT = VC.utils.serializeSignMessage(params);
```

#### `createPresentation`

Invoke this method to generate a presentation with credential data signed by the user. It returns the presentation as a JWT string.

It takes an object parameter containing:

1. `signMessage` - Serialized JWT string (using [`serializeSignMessage`](#serializesignmessage))
2. `signature` - Serialized JWT string that has been signed by the user

The parameter object is of the following form.

```javascript
{
  signMessage: string,
  signature: string
}
```

```js
const JWT = VC.utils.createPresentation(params);
```

Presentation data can be obtained by deserializing this token. You can perform signature verification and message decryption using the Java SDK. Follow this [link]() for reference.

#### `deserialize`

You can obtain the user's verified KYC data by deserializing the `encryptOriginData` string in the credential object received [here](#fetching-the-issued-credential).

This method takes the serialized JWT string as parameter and returns an object containing credential data.

```js
const result = VC.utils.deserialize(string);
```

The response object is of the following form.

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
