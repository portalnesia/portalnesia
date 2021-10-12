/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Portalnesia from '@portalnesia/react-native-core'

const notificationHandler=async(notification)=>{
    console.log(notification);
    if(notification?.key === Portalnesia.Notification.REPLY_KEY && notification?.messages) {
        try {
            Portalnesia.Notification.addReplyNotification(notification?.notification_id,{sender:"Portalnesia",text:notification?.messages});
        } catch(e) {
            console.log(e);
            Portalnesia.Notification.errorReplyNotification(notification?.notification_id)
        }
    }
    if(notification?.key === "mark_as_read") {
        setTimeout(()=>Portalnesia.Notification.cancel(notification?.notification_id),1000);
    }
    return Promise.resolve();
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(Portalnesia.Notification.HEADLESS_TASK, () => notificationHandler);