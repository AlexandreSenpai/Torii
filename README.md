# [Odysseus] Authentication
This project takes the responsability of authenticate users that are trying to access odysseus resources.

## Requirements
- NodeJS v14 +
- serverless cli
- AWS cli

### List of environment variables needed to run this software properly:

|Variable|Description|
|----|-----------|
|`JWT_SECRET`|The secret key used for signing the JWT.|
|`JWT_EXPIRATION_SECONDS`|The number of seconds before the JWT token expires.|
|`SAML_IDP_URL`|The login URL of the SAML-based identity provider|
|`SAML_CALLBACK_URL`|The callback URL after the user authenticates with the identity provider.|
|`SAML_ISSUER`|The SAML Issuer URL. ex: Okta|

# Building
To build this project run the following bash script:

```sh
  yarn build
```

# Deployment
To deploy run, make sure you are in the builded project folder `dist`, then run:
```
npx serverless deploy
```
