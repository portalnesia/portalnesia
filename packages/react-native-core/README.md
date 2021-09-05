# @portalnesia/react-native-core
Native Module for Portalnesia Application


## Getting started

### Install via NPM

`$ npm install @portalnesia/react-native-core --save`

### Mostly automatic installation

`$ react-native link @portalnesia/react-native-core`

<br />

## Setup

### Generating android credentials

Download `google-services.json` from firebase console and place it inside of your project at the following location: `/android/app/google-services.json`

### Configure with android credentials

First, add the `google-services` plugin as a dependency inside of your `/android/build.gradle` file:

```groovy
buildscript {
    dependencies {
        // ... other dependencies
        classpath 'com.google.gms:google-services:4.3.10' // Add this
        // 4.3.10 is example, use the latest version
    }
}
```

Last, execute the plugin by adding the following to your `/android/app/build.gradle` file:

```groovy
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services' // Add this
```

### SafetyNet Verification API Key
To use SafetyNet Attestation, you must obtain your Android Device Verification API (tutorial <a href="https://developer.android.com/training/safetynet/attestation#obtain-api-key" target="_blank">here</a>).

Add your `Android Device Verification API` to your strings.xml `/android/app/src/main/res/values/strings.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- ... others string -->
    <string name="portalnesia_verification_key">verification key</string>
<resources>
```

### Recaptcha Site Key
To use Recaptcha, you must register a reCAPTCHA key pair (tutorial <a href="https://developer.android.com/training/safetynet/recaptcha#register" target="_blank">here</a>).

Add `Recaptcha Site key` to your strings.xml `/android/app/src/main/res/values/strings.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- ... others string -->
    <string name="portalnesia_recaptcha_key">recaptcha key</string>
<resources>
```

### Custom Android Notification Icon
If you want to change the notification icon. Add your icon to project resources mipmap folder `/android/app/src/main/res/mipmap...`.

Make sure you follow <a href="https://material.io/design/iconography/product-icons.html#design-principles" target="_blank">Google's design guidelines</a> (the icon must be all white with a transparent background) or else it may not be displayed as intended.

### Custom Android Notification Color
If you want to change the notification color. Add your color to project resources color folder `/android/app/src/main/res/values/colors.xml`

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<resources>
    <!-- ...others color -->
    <color name="portalnesia_notification_color">#2f6f4e</color>
</resources>
```

<br />

## Usage
```javascript
import {View,Text} from 'react-native'
import Portalnesia from '@portalnesia/react-native-core';

// This from example
export default class App extends Component {
    state = {
        brightness: 'waiting',
    };

    async init() {
        // BRIGHTNESS
        try {
            const brightness = await Portalnesia.Brightness.getSystemBrightness();
            this.setState({brightness})
        } catch(e) {
            this.setState({brightness:`Error: ${e?.message}`})
        }
    }

    componentDidMount() {
        this.init();
    }

    render() {
        return(
            <View>
                <Text>{`Brightness: ${this.state.brightnessa}`}</Text>
            </View>
        )
    }
}
```

<br />

## API

## Core

### Constants

- ### `Core.initialLocalization`
    Return [`LocalizationConstants`](#localizationconstants), initial values of localization 

- ### `Core.SUPPORTED_ABIS`
    Return array of string abi supported by device

### Method

- ### `Core.isAppInstalled(packageName: string): Promise<boolean>`
    Check if the application is installed on the device.

    **Note**: From Android 11 (API 30), you might need to declare `<queries>` in your manifest, depending on what package you're looking for. Check out [the docs](https://developer.android.com/training/package-visibility) for more info.

    ### Arguments
    - packageName (*string*) -- the package name of the application that you want to check

    ### Returns
    Return a promise that resolves to `true` if tha application is installed, otherwise `false`.

- ### `Core.openDownloadManager(): void`
    Function to open device's download manager.

- ### `Core.getAction(): Promise<string>`
    Get intent action

    ### Returns
    Return a promise that resolves to a `string` of intent action

- ### `Core.exitApp(): void`
    Function to exit the application

- ### `Core.getCountry(): String`
    alias for `Core.initialLocalization.country`

- ### `Core.getLocales(): Locale[]`
    alias for `Core.initialLocalization.locales`

- ### `Core.addEventListener(type: 'localizationChange', handler: ()=>void ): void`
    Add listener when user change their localization (language, region)

    ### Arguments
    - type (*string*) -- Type of event listener. For now, only support `localizationChange`
    - handler (*function*) -- Function to be invoked

- ### `Core.removeEventListener(type: 'localizationChange', handler: ()=>void ): void`
    Remove listener

    ### Arguments
    - type (*string*) -- Type of event listener. For now, only support `localizationChange`
    - handler (*function*) -- Function

<br />

## Safetynet

- ### `Safetynet.isGooglePlayServicesAvailable(): Promise<boolean>`
    Check that the correct version of Google Play services is installed on the user's device.

    ### Returns
    Return a promise that resolve to `true` if google play services is installed and up to date, otherwise `false`

- ### `Safetynet.getVerification(nonce: string): Promise<string>`
    Request a SafetyNet attestation. Your app can use the SafetyNet Attestation service. The API should be used as a part of your abuse detection system to help determine whether your servers are interacting with your genuine app running on a genuine Android device. For more detail, you can read about SafetyNet on <a href="https://developer.android.com/training/safetynet/attestation" target="_blank">Official Docs</a>. 
    
    ## **Make sure you have added your [Verification API Key](#safetynet-verification-api-key)**

    ### Agruments
    - nonce (*string*) -- When calling the SafetyNet Attestation API, you must pass in a nonce. The resulting attestation contains this nonce, allowing you to determine that the attestation belongs to your API call and isn't replayed by an attacker.

    ### Returns
    Return a promise that resolve to `token` (*string*). This token is used to verify the application from your backend server.

- ### `Safetynet.verifyWithRecaptcha(): Promise<string>`
    Use Google Recaptcha API that you can use to protect your app from malicious traffic. 
    ## **Make sure you have added your [Recaptcha Site Key](#recaptcha-site-key)**

    ### Returns
    Return a promise that resolve to `token` (*string*). This token is used to validate the user's response token from your backend server.

<br />

## Brightness

- ### `Brightness.getBrightness():Promise<number>`
    Get device's brightness if it was previously set using `setBrightness()`.

    ### Returns
    Return a promise that resolve to `float` between 0 and 1. Or -1 if not already set using `setBrightness`.

- ### `Brightness.getSystemBrightness(): Promise<number>`
    Get device's system brightness. The difference is, the value returned is the system brightness on the device. 

- ### `Brightness.setBrightness(value: number): Promise<void>`
    Set device's brightness. The brightness value is automatically reset to system brightness value after user exit the application

    ### Arguments
    - value (*number*) -- The brightness value between 0 and 1.

<br />

## Files

- ### `Files.openFolder(location: string): Promise<void>`
    Instructs the device to open a folder using the file manager

    ### Arguments
    - location (*string*) -- The folder location that you want to open. Without scheme `file://`. Example: `/storage/emulated/0/Portalnesia`

- ### `Files.getRealPathFromSaf(saf: string): Promise<string>`
    Get real path from Android Storage Access Framework (*saf*)

    ### Arguments
    - SAF (*string*) -- SAF uri

    ### Returns
    Return a promise that resolves to a real path storage

- ### `Files.getUriPermission(): Promise<string[]>`
    Get SAF uri that has been granted access

    ### Returns
    Return a promise that resolves to list of SAF uri. The returned array can be empty if you haven't requested SAF access

## Notification

### Constants

- ### `Notification.PRIORITY_DEFAULT`
- ### `Notification.PRIORITY_HIGH`
- ### `Notification.PRIORITY_LOW`
- ### `Notification.PRIORITY_MAX`
- ### `Notification.PRIORITY_MIN`
- ### `Notification.VISIBILITY_PRIVATE`
- ### `Notification.VISIBILITY_PUBLIC`
- ### `Notification.VISIBILITY_SECRET`

### Method

- ### `Notification.notify(id: number, channel_id: string, options: NotificationOptions): Promise<void>`
    Show notification or update the notification.

    ### Arguments
    - id (*number*) -- Notification identifier. If you want update the existing notification, you can call again this function with same notificaion identifier.
    - channel_id (*string*) -- Notification Channel ID. Before you can deliver the notification on Android 8.0 and higher, you must register your app's notification channel.
    - options (*object*) -- NotificationOptions object. For more detail, click [`NotificationOptions`](#notificationoptions).

- ### `Notification.cancel(id: number): void`
    Remove notification from notification tray

    ### Arguments
    - id (*number*) -- The notification identifier you previously used to display the notifications

- ### `Notification.cancelAll(): void`
    Remove all notifications from your application

<br />

## Types

### `LocalizationConstants`

```typescript
{
    country: string,
    locales: Locale[]
}
```

### `Locale`
```typescript
{
    languageCode: string,
    countryCode: string,
    languageTag: string
}
```

### `NotificationOptions`
```typescript
{
    /**
     * Title of notification
     */
    title: string;
    /**
     * Body of notification
     */
    body?:string;
    /**
     * deepurl when notification clicked
     */
    uri?: string;
    visibility?: number;
    priority?: number;
    /**
     * If set, show progress in notification
     */
    progress?: {
        max:number,
        progress: number,
        intermediate: boolean
    };
    /**
     * If true, the notification will be removed when the user taps on it.
     */
    autoCancel?: boolean;
    /**
     * If true, notification cannot be dismissed
     */
    onGoing?: boolean;
    /**
     * Will show notification silently
     */
    silent?: boolean;
}
```

