import {NativeModules,NativeModulesStatic} from 'react-native'

export interface NotificationOptions {
    /**
     * deepurl when notification clicked
     */
    uri?: string;
    /**
     * Title of notification
     */
    title: string;
    /**
     * Body of notification
     */
    body?:string;
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

export interface PortalnesiaNotificationInterface {
    /**
     * Show/update notification
     * @param id notification_id
     * @param channel_id Channel ID
     * @param options 
     */
    notify(id: number, channel_id: string, options: NotificationOptions): Promise<void>;
    cancel(id: number): void;
    cancelAll(): void;
    PRIORITY_DEFAULT: number;
    PRIORITY_HIGH: number;
    PRIORITY_LOW: number;
    PRIORITY_MAX: number;
    PRIORITY_MIN: number;
    VISIBILITY_PRIVATE: number;
    VISIBILITY_PUBLIC: number;
    VISIBILITY_SECRET: number;
}

const {PortalnesiaNotification:Notification} = <{PortalnesiaNotification:PortalnesiaNotificationInterface} & NativeModulesStatic>NativeModules

export default Notification;