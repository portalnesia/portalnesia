import {NativeModules,NativeModulesStatic} from 'react-native'

class NotificationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PortalnesiaNotificationError";
    }
}

export interface NotificationMessagesBasic {
    /**
     * Unique sender username of messages
     * return same as title for messages by the current user
     */
    sender: string;
    /**
     * Sender image
     * return same as title for messages by the current user
     */
    image?: string;
    /**
     * Message to be displayed
     */
    text: string;
}
export interface NotificationMessages extends NotificationMessagesBasic {
    /**
     * Time at which the message arrived in ms
     */
    time: number;
}
export interface NotificationMessagesReply extends NotificationMessagesBasic {
    /**
     * Time at which the message arrived in ms
     */
    time?: number;
}

export interface NotificationMessageObject {
    /**
         * Unique sender username for current user
         */
     title: string;
     /**
      * Sender image for current user
      */
     image?: string;
     /**
      * Reply label for notification action
      */
     label: string;
     /**
      * Extra variable.
      * This variable will be sending to headlesstask service when reply action clicked
      */
     extra?: Record<string, any>;
     message: NotificationMessages[];
}

export interface NotificationActionType {
    /**
     * Action label for notification
     */
    label: string;
    /**
     * Action identifier
     */
    key: string;
    /**
     * Extra variable.
     * This variable will be sending to headlesstask service when action clicked
     */
    extra?: Record<string, any>;
}
export interface NotificationOptions {
    /**
     * Title of notification
     */
     title?: string;
     /**
      * Body of notification
      */
     body?: string;
     /**
      * If set, show progress in notification
      */
     progress?: {
         max: number;
         progress: number;
         intermediate: boolean;
     };
    /**
     * deepurl when notification clicked
     */
    uri?: string;
    visibility?: number;
    priority?: number;
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
    /**
     * Notification Action
     */
    action?: NotificationActionType[];
    /**
     * Notification large icon
     */
    largeIcon?: string;
    /**
     * Notification large icon with expandable view
     */
    images?: string;
    /**
     * Messaging style notification
     */
     messages?: NotificationMessageObject;
}
export interface NotificationHandler {
    /**
     * Notification action key that clicked
     */
    key: string;
    /**
     * Notification id
     */
    notification_id: number;
    /**
     * Replied text message if key === Notification.REPLY_KEY
     */
    messages?: string;
    /**
     * Any extra params provided when call Notification.notify() function
     */
    extra?: Record<string, any>;
}

export interface PortalnesiaNotificationInterface {
    notify(id: number, channel_id: string, options: NotificationOptions): Promise<void>;
    addReplyNotification(id: number,message: NotificationMessagesReply): Promise<void>;
    errorReplyNotification(id: number): Promise<void>;
    cancel(id: number): void;
    cancelAll(): void;
    isNotificationActive(id: number): Promise<boolean>;
    PRIORITY_DEFAULT: number;
    PRIORITY_HIGH: number;
    PRIORITY_LOW: number;
    PRIORITY_MAX: number;
    PRIORITY_MIN: number;
    VISIBILITY_PRIVATE: number;
    VISIBILITY_PUBLIC: number;
    VISIBILITY_SECRET: number;
}

const {PortalnesiaNotification} = <{PortalnesiaNotification:PortalnesiaNotificationInterface} & NativeModulesStatic>NativeModules

module Notification {
    /**
     * Show/update notification
     * @param id notification id
     * @param channel_id Channel ID
     * @param options 
     */
    export async function notify(id: number, channel_id: string, options: NotificationOptions): Promise<void> {
        if(typeof id !== 'number') {
            throw new NotificationError("ID cannot be empty");
        }
        if(!options?.title && !options?.messages) {
            throw new NotificationError("options.title cannot be empty, if options.message is not set");
        }
        return PortalnesiaNotification.notify(id, channel_id, options);
    }
    /**
     * Adding new message to messaging style notification
     * @param id notification id
     * @param message message object
     */
    export function addReplyNotification(id: number,message: NotificationMessagesReply): Promise<void> {
        if(typeof id !== 'number' && !message) {
            throw new NotificationError("ID and Message cannot be empty");
        }
        return PortalnesiaNotification.addReplyNotification(id,message);
    }
    /**
     * Update messaging style notification to stop loading. Example, if the reply action fails.
     * @param id notification id
     */
    export function errorReplyNotification(id: number): Promise<void> {
        if(typeof id !== 'number') {
            throw new NotificationError("ID cannot be empty");
        }
        return PortalnesiaNotification.errorReplyNotification(id);
    }
    /**
     * Check if notification is on notification tray
     * @param id Notification id
     */
    export function isNotificationActive(id: number): Promise<boolean> {
        if(typeof id !== 'number') {
            throw new NotificationError("ID cannot be empty");
        }
        return PortalnesiaNotification.isNotificationActive(id);
    }
    /**
     * Cancel notification
     * @param id notification id
     */
    export function cancel(id: number): void {
        if(typeof id !== 'number') {
            throw new NotificationError("ID cannot be empty");
        }
        return PortalnesiaNotification.cancel(id);
    }
    /**
     * Cancel all notification
     */
    export function cancelAll(): void {
        return PortalnesiaNotification.cancelAll();
    }
    export const PRIORITY_DEFAULT = PortalnesiaNotification.PRIORITY_DEFAULT;
    export const PRIORITY_HIGH = PortalnesiaNotification.PRIORITY_HIGH;
    export const PRIORITY_LOW = PortalnesiaNotification.PRIORITY_LOW;
    export const PRIORITY_MAX = PortalnesiaNotification.PRIORITY_MAX;
    export const PRIORITY_MIN = PortalnesiaNotification.PRIORITY_MIN;

    export const VISIBILITY_PRIVATE = PortalnesiaNotification.VISIBILITY_PRIVATE;
    export const VISIBILITY_PUBLIC = PortalnesiaNotification.VISIBILITY_PUBLIC;
    export const VISIBILITY_SECRET = PortalnesiaNotification.VISIBILITY_SECRET;

    export const HEADLESS_TASK = "PortalnesiaNotificationHeadlessTask";
    export const REPLY_KEY = "portalnesia_reply_key";
}

export default Notification;