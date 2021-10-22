import {NativeModules,NativeModulesStatic} from 'react-native'

type HeaderArray = [string,string];
export interface DownloadOptions {
    /**
     * Download URL
     */
    uri: string;
    /**
     * File destination
     */
    destination:{
        /**
         * Public directory type
         */
        type: "Download" | "Movies" | "Pictures" | "Music",
        /**
         * Filename
         */
        path: string
    }
    mimeType: string;
    headers?: HeaderArray[];
    /**
     * Title for notification
     */
    title?: string;
    /**
     * Description for notification
     */
    description?:string;
    /**
     * Channel ID for completed notification
     */
    channel_id?:string;
}

export interface PortalnesiaFiles {
     openFolder(location: string): Promise<void>;
     getRealPathFromSaf(saf: string): Promise<string>;
     getUriPermission(): Promise<string[]>;
     removeUriPermission(saf: string): Promise<void>;
     download(options: DownloadOptions): Promise<number>
     DIRECTORY_DOWNLOADS: string;
     DIRECTORY_MOVIES: string;
     DIRECTORY_PICTURES: string;
     DIRECTORY_MUSIC: string;
}

const {PortalnesiaFile} = <{PortalnesiaFile:PortalnesiaFiles} & NativeModulesStatic>NativeModules

module Files {
    /**
     * @argument
     * location: filepath with file://
     */
    export function openFolder(location: string) {
        return PortalnesiaFile.openFolder(location);
    }
    /**
     * Get real path storage from `content://` uri
     * @param saf content://......
     */
    export function getRealPathFromSaf(saf: string) {
        return PortalnesiaFile.getRealPathFromSaf(saf);
    }
    export function getUriPermission() {
        return PortalnesiaFile.getUriPermission();
    }
    export function removeUriPermission(saf: string) {
        return PortalnesiaFile.removeUriPermission(saf);
    }
    /**
     * File Downloader using Download Manager 
     * @param options DownloadOptions
     * @returns Promise resolve to download ID
     */
    export function download(options: DownloadOptions) {
        return PortalnesiaFile.download(options);
    }

    export const DIRECTORY_DOWNLOADS = PortalnesiaFile.DIRECTORY_DOWNLOADS as "Download";
    export const DIRECTORY_MOVIES = PortalnesiaFile.DIRECTORY_MOVIES as "Movies";
    export const DIRECTORY_PICTURES = PortalnesiaFile.DIRECTORY_PICTURES as "Pictures";
    export const DIRECTORY_MUSIC = PortalnesiaFile.DIRECTORY_MUSIC as "Music";
}

export default Files;