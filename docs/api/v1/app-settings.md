---
id: app-settings
title: App Settings
keywords:
    - Create application
    - Portalnesia application
modified: 2022-02-05 19:27
---

To be able to access Portalnesia resources, You need Portalnesia application as a client. This article describes how to create an apps and configure it.

> You need Portalnesia account to create an application

# Register

1. Go to [`My Apps`](/developer/apps), and click **Create Apps**

    ![My Apps](https://i.imgur.com/sv5e5WW.jpeg)

2. Enter **Aplication Name** and **Application Description** and then click **CREATE**

    ![My Apps](https://i.imgur.com/7Yh8FzS.jpeg)

3. You have successfully created an application


# App Configuration

After created an apps, now configure it.

1. In `My Apps`, click `pencil` icon to edit your apps
2. In Application Detail page, edit the available form according to your application.

3. Store your `client_id`
4. If your application is newly created, click `regenerate` to generate a `client_secret` and store it securely
5. Save the changes you made, and you can proceed to the next process, which is preparing your client application

   

## Explanation of Each Form

### App Name

***Required***   
The name of your application. The name must not contain the word `portalnesia`

### App Description

***Optional***   
Brief description of your application. Try to be easy to understand, so that users can know your application when authenticating


### Wesite URL

***Optional***  
URL of your application/organization website, if any.

### Origin

***Optional***   
If your application makes an http request to Portalnesia REST API on the browser, then you must provide the origin url of your application. Otherwise, the http request will fail, because the browser will restrict cross-origin requests. You can read more about cors [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

> You can add up to 5 urls.


### Scopes

***Optional***  
Scope that your application requests. The available scope is a list of scopes that have been approved for your portalnesia apps. Read more about scope [here](/developer/docs/scopes).



### Authorization Flows

***Optional***  
Oauth2 authorization flows used by your application. Explanation of each flows, can be read [here](/developer/docs/authorization)


### Callback URI

***Optional***     
Redirect url when your application asks for user authorization (`redirect_uri`). If the value of *callback_uri* is empty, your app cannot access for authorization

### Terms of Service

***Optional but strongly recommended***   
Terms of service url of your application. So the user knows what the terms of service are in your application before authorizing

### Privacy Policy

***Optional but strongly recommended***   
Privacy policy url of your application. So the user knows how the data on Portalnesia will be used by your application

### Test Users

***Optional***   
If your application is not yet in production mode. You will not be able to request authorization from users (except for your own account). In order to request authorization from a user other than you, enter the portalnesia user in this form.

> You can add up to 5 users

### Icon

***Optional***   
The icon of your application/organization


### Publish

***Optional***    
If publish status is checked, it means your application is ready in production mode.

> Make sure all the features and functions of your application are working before publishing it