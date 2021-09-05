import {NativeModules,NativeModulesStatic,DeviceEventEmitter} from 'react-native'

export type Locale = Readonly<{
    languageCode: string,
    countryCode: string,
    languageTag: string
}>

export type LocalizationConstants = Readonly<{
    country: string,
    locales: Locale[]
}>

interface PortalnesiaCoreNativeInterface {
    initialLocalization: LocalizationConstants;
    SUPPORTED_ABIS: String[];
    isAppInstalled(packageName: string): Promise<boolean>;
    openDownloadManager(): void;
    getAction(): Promise<string>;
    exitApp(): void;
}

const {PortalnesiaCore:CoreNative} = <{PortalnesiaCore:PortalnesiaCoreNativeInterface} & NativeModulesStatic>NativeModules

let constants: LocalizationConstants = CoreNative.initialLocalization
const handlers: Set<Function> = new Set();
DeviceEventEmitter.addListener("localizationChange",(next: LocalizationConstants)=>{
    if(JSON.stringify(next) !== JSON.stringify(constants)) {
        constants = next;
        handlers.forEach(handler=>handler());
    }
})

export interface PortalnesiaCoreInterface extends PortalnesiaCoreNativeInterface {
    getCountry(): String;
    getLocales(): Locale[];
    addEventListener(type: 'localizationChange', handler: Function): void;
    removeEventListener(type:'localizationChange',handler: Function): void;
}

const Core: PortalnesiaCoreInterface = {
    initialLocalization:CoreNative.initialLocalization,
    SUPPORTED_ABIS:CoreNative.SUPPORTED_ABIS,
    isAppInstalled(packageName: string) {
        return CoreNative.isAppInstalled(packageName);
    },
    openDownloadManager() {
        return CoreNative.openDownloadManager();
    },
    getAction() {
        return CoreNative.getAction();
    },
    exitApp() {
        return CoreNative.exitApp();
    },
    /**
     * Get current country ("US","ID",...)
     * @returns string
     */
    getCountry() {
        return constants.country;
    },
    /**
     * Get list of locales in devices
    */
    getLocales() {
        return constants.locales
    },
    addEventListener(type: 'localizationChange', handler: Function) {
        if(type === 'localizationChange') {
            handlers.add(handler);
        }
    },
    removeEventListener(type:'localizationChange',handler: Function) {
        if(type === 'localizationChange') {
            handlers.delete(handler)
        }
    }
}

export default Core;