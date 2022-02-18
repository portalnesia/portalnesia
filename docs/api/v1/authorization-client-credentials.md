---
id: authorization-client-credentials
title: Client Credentials
keywords:
    - authentication
    - Oauth2
    - authorization_code
    - refresh_token
    - client_credentials
    - access_token
    - openid
modified: 2022-02-05 19:27
---

The Client Credentials flow is used in server-to-server authentication. Since this flow does not include authorization, only endpoints that do not access user information can be accessed.

# Prerequisites

This guide assumes that you have created an app following the [app settings docs](/developer/docs/app-settings).

Base uri for all authorization requests is 

```
https://accounts.portalnesia.com
```


# Request Authorization

The first step is to send a POST request to the `/oauth/token` endpoint of the Portalnesia OAuth 2.0 Service with the following parameters encoded in `application/x-www-form-urlencoded`:

| REQUEST BODY PARAMETER | VALUE |
| --- | --- |
| grant_type | *Required*<br />This field must contain the value `client_credentials`.  |
| redirect_uri | *Required*<br />This parameter is used for validation only (there is no actual redirection). The value of this parameter must exactly match the value of `redirect_uri` supplied when requesting the authorization code. |

The request must include the following HTTP headers:

| HEADER PARAMETER | VALUE |
| --- | --- |
| PN-Client-Id | *Required*<br />The client ID for your app, available from the developer dashboard. |
| Authorization | *Required*<br />Base 64 encoded string that contains the client ID and client secret key. The field must have the format: `Authorization: Basic <base64 encoded client_id:client_secret>` |
| Content-Type | *Required*<br />Set to `application/x-www-form-urlencoded` |

If everything goes well, you’ll receive a response similar to this containing the Access Token:

```json
{
  "access_token": "NgCXRKc...MzYjw",
  "token_type": "bearer",
  "scope": "basic blog chord",
  "expires_in": 3600,
  "refresh_token": "NgAagA...Um_SHo"
}
```

| KEY | TYPE | VALUE |
| --- | --- | --- |
| access_token | *string* | An Access Token that can be provided in subsequent calls |
| token_type | *string* | How the Access Token may be used: always “Bearer”. |
| scope | *string* | A space-separated list of scopes which have been granted for this `access_token` |
| expires_in | *int* | 	The time period (in seconds) for which the Access Token is valid. |