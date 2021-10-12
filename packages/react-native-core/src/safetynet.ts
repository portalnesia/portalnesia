import {NativeModules,NativeModulesStatic} from 'react-native'

export interface PortalnesiaSafetynet {
    isGooglePlayServicesAvailable(): Promise<boolean>;
    /**
     * Get device verification
     * @param nonce random string
     * @return token to verify in server side
     */
    getVerification(nonce: string): Promise<string>;
    /**
     * Recaptcha
     * @return token to verify in server side
     */
    verifyWithRecaptcha(): Promise<string>;
}

const {PortalnesiaSafetynet:Safetynet} = <{PortalnesiaSafetynet:PortalnesiaSafetynet} & NativeModulesStatic>NativeModules

export default Safetynet;