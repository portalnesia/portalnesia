---
title: Getting Started
---

This describes the resources that make up the official Portalnesia REST API. If you have any problems or requests, please contact [Portalnesia Support](/contact)

# Before You Start

You will need access to the following:

- Portalnesia account
- Registered Portalnesia App with `basic` scope

# Register Application

1. On [your dashboard](/developer/apps), click Create App.
2. Enter **Aplication Name** and **Application Description** and then click **CREATE**. Your application is registered with default `basic` scope, and the app view opens
3. On the app view, click **Edit Settings** to view and update your app settings

***Note:*** Find your `Client ID` and `Client Secret`. You need them in the authentication phase.

- **Client ID** is the unique identifier of your application.
- **Client Secret** is the key that you pass in secure calls to the Portalnesia Accounts and REST API services.

> Client secret key is shown ***only once***. **Always store the client secret key securely**. If you forget the secret key or if you suspect that the secret key has been compromised, you have to regenerate it immediately by clicking the link on the edit settings view

# Endpoint

The API is accessed by making HTTP requests to a specific version endpoint URL, in which GET or POST variables contain information about what you wish to access. Every endpoint is accessed via an SSL-enabled HTTPS (port 443), this is because everything is using OAuth 2.0.

The stable HTTP endpoint for latest Portalnesia API is:

```
https://api.portalnesia.com/v1
```

# Authentication

To have the end user approve your app for access to their Portalnesia data and features, or to have your app fetch data from Portalnesia, you need to authorize your application. Portalnesia API uses OAuth 2.0 protocol for authorization.

```bash
curl -H "Authorization: Bearer ACCESS-TOKEN" -H "PN-Client-Id: YOUR-CLIENT-ID" https://api.portalnesia.com/v1
```

For more detail about authentication, see [Authentication Page](/developer/docs/authentication)

# Rate Limit

The Portalnesia API uses a credit allocation system to ensure fair distribution of capacity. Each application can allow **approximately 12.500 requests per day**. Authenticated requests are associated with the client id. To stop an app from requesting more data, we also limit requests to 60 requests per minute.

There are some endpoints that have their own request limits which you can read about in the API Reference. The remaining credits from this endpoint will be shown with each request response in the `X-RateLimit-Limit` HTTP header.

For more detail about rate limit, see [Rate Limit Page](/developer/docs/rate-limit)

# Response

Each response except authentication is wrapped in a data tag. This means if you have a response except authentication response, it will always be within the data field.

Some api with pagination response (/v1/blog, /v1/chord, etc) is wrapped with a pagination interface.

### Success Response Example

```json
{
    "error":false,
    "message":"Additional message from API server, if any",
    "data":{
        
    }
}
```

### Error Response Example

```json
{
    "error":{
        "name": "Error name",
        "message": "Error message"
    }
}
```

### Pagination Response Example

```json
{
    "error":false,
    "message":"Additional message from API server, if any",
    "data":{
        "page": 1,
        "total_page": 5,
        "can_load":false,
        "total": 75,
        "data": {

        }
    }
}
```