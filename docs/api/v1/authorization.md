---
id: authorization
title: Authorization
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

# Introduction

Authorization refers to the process of granting a user or application access permissions to Portalnesia data and features. Portalnesia implements the OAuth 2.0 authorization framework.

The access to the protected resources is determined by one or several scopes. Scopes enable your application to access specific functionality (e.g. read a chord or modify your blog) on behalf of a user. The set of scopes you set during the authorization, determines the access permissions that the user is asked to grant. You can find detailed information about scopes in the [scopes guide](/developer/docs/scopes).

The authorization process requires valid client credentials: a client ID and a client secret. You can follow the [App settings docs](/developer/docs/app-settings) to learn how to generate them.

Once the authorization is granted, the authorization server issues an access token, which is used to make API calls on behalf the user or application.

The OAuth2 standard defines four grant types (or flows) to request and get an access token. Portalnesia implements the following ones:

- [Authorization code](/developer/docs/authorization-code-flow) ([with PKCE extension](/developer/docs/authorization-pkce))
- [Client credentials](/developer/docs/authorization-client-credentials)


# Which OAuth flow should I use?

Choosing one flow over the rest depends on the application you are building:

- If you are developing a long-running application (e.g. web app running on the server) in which the user grants permission only once, and the client secret can be safely stored, then the [authorization code](/developer/docs/authorization-code-flow) flow is the recommended choice.
- In scenarios where storing the client secret is not safe (e.g. desktop, mobile apps or JavaScript web apps running in the browser), you can use the [authorization code with PKCE](/developer/docs/authorization-pkce), as it provides protection against attacks where the authorization code may be intercepted.
- For some applications running on the backend, such as CLIs or daemons, the system authenticates and authorizes the app rather than a user. For these scenarios, [Client credentials](/developer/docs/authorization-client-credentials) is the typical choice. This flow does not include user authorization, so only endpoints that do not request user information (e.g. geodata or twitter thread) can be accessed.


The following table summarizes the flows behaviors:

| FLOW | ACCESS USER RESOURCES | REQUIRES SECRET KEY (SERVER-SIDE) | ACCESS TOKEN REFRESH |
| --- | --- | --- | --- |
| Authorization code | Yes | Yes | Yes |
| Authorization code with PKCE | Yes | No | Yes |
| Client credentials | No | Yes | Yes |

