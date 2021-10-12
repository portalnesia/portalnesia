package com.portalnesia.pkg.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.core.app.RemoteInput;

import com.facebook.react.HeadlessJsTaskService;

public class NotificationReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getStringExtra("key");
        int id = intent.getIntExtra("notification_id",0);

        Bundle extra = intent.getBundleExtra("extra");
        try {
            Intent service = new Intent(context,HeadlessNotificationServices.class);
            service.putExtra("extra",extra);
            service.putExtra("key",action);
            service.putExtra("notification_id",id);
            if(action.equals(PortalnesiaNotificationModule.REPLY_KEY)) {
                CharSequence replyMsg = getMessageText(intent);
                if(replyMsg != null && replyMsg.length() > 0) {
                    service.putExtra("messages",replyMsg.toString());
                }
            }
            context.startService(service);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        } catch (Throwable ignored) {

        }
    }

    private CharSequence getMessageText(Intent intent) {
        Bundle remoteInput = RemoteInput.getResultsFromIntent(intent);
        if(remoteInput != null) {
            return remoteInput.getCharSequence(PortalnesiaNotificationModule.REPLY_KEY);
        }
        return null;
    }
}
