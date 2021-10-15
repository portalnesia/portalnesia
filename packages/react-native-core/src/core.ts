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
    restartApp(): Promise<void>
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

module Core {
    export const initialLocalization = CoreNative.initialLocalization;
    export const SUPPORTED_ABIS=CoreNative.SUPPORTED_ABIS;
    export function isAppInstalled(packageName: string) {
        return CoreNative.isAppInstalled(packageName);
    }
    export function openDownloadManager() {
        return CoreNative.openDownloadManager();
    }
    export function getAction() {
        return CoreNative.getAction();
    }
    export function restartApp(){
        return CoreNative.restartApp();
    }
    /**
     * Get current country ("US","ID",...)
     * @returns string
     */
    export function getCountry() {
        return constants.country;
    }
    /**
     * Get list of locales in devices
    */
     export function getLocales() {
        return constants.locales
    }
    export function addEventListener(type: 'localizationChange', handler: Function) {
        if(type === 'localizationChange') {
            handlers.add(handler);
        }
    }
    export function removeEventListener(type:'localizationChange',handler: Function) {
        if(type === 'localizationChange') {
            handlers.delete(handler)
        }
    }
}

export default Core;