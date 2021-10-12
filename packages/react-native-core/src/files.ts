import {NativeModules,NativeModulesStatic} from 'react-native'

export interface PortalnesiaFiles {
    /**
     * @argument
     * location: filepath with file://
     */
     openFolder(location: string): Promise<void>;
     /**
      * Get real path storage from `content://` uri
      * @param saf content://......
      */
     getRealPathFromSaf(saf: string): Promise<string>;
     getUriPermission(): Promise<string[]>;
     removeUriPermission(saf: string): Promise<void>;
}

const {PortalnesiaFile:Files} = <{PortalnesiaFile:PortalnesiaFiles} & NativeModulesStatic>NativeModules
export default Files;