import {NativeModules,NativeModulesStatic} from 'react-native'

export interface PortalnesiaBrightness {
    getBrightness():Promise<number>;
    /**
     * Set device brightness
     * @param value number between 0 & 1;
     */
    setBrightness(value: number): Promise<void>;
    getSystemBrightness(): Promise<number>;
}

const {PortalnesiaBrightness:Brightness} = <{PortalnesiaBrightness:PortalnesiaBrightness} & NativeModulesStatic>NativeModules

export default Brightness;