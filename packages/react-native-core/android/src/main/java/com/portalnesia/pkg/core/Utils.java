package com.portalnesia.pkg.core;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.service.notification.StatusBarNotification;
import android.text.TextUtils;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.Person;
import androidx.core.graphics.drawable.IconCompat;

import com.facebook.react.bridge.ReadableMap;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Utils {
    public static long getTime() {
        return System.currentTimeMillis();
    }

    @Nullable
    @RequiresApi(api = Build.VERSION_CODES.N)
    public static Notification findActiveNotification(Context context, int notificationId) {
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        StatusBarNotification[] sbns = nm.getActiveNotifications();
        if(sbns != null && sbns.length > 0) {
            for(StatusBarNotification sbn: sbns) {
                if(sbn.getId() == notificationId) {
                    return sbn.getNotification();
                }
            }
        }
        return null;
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static void updateReply(Context context, int notificationId, @Nullable ReadableMap msg) {
        final Notification activeNotification = findActiveNotification(context,notificationId);

        assert activeNotification != null;
        NotificationCompat.MessagingStyle activeStyle = NotificationCompat.MessagingStyle.extractMessagingStyleFromNotification(activeNotification);
        NotificationCompat.Builder recoveredBuilder = new NotificationCompat.Builder(context,activeNotification);
        assert activeStyle != null;
        CharSequence title = activeStyle.getUser().getName();
        assert title != null;
        Person titlePerson = new Person.Builder().setName(title).setKey(title.toString()).build();
        NotificationCompat.MessagingStyle style = new NotificationCompat.MessagingStyle(titlePerson);

        for(NotificationCompat.MessagingStyle.Message message: activeStyle.getMessages()) {
            Person person = message.getPerson();
            style.addMessage(new NotificationCompat.MessagingStyle.Message(message.getText(),message.getTimestamp(),person));
        }
        if(msg != null) {
            String sender = msg.getString("sender");
            String message = msg.getString("text");
            long time;
            if(msg.hasKey("time")) {
                time = msg.getInt("time");
            } else {
                time = getTime();
            }
            Person senderPerson=null;
            if(!TextUtils.equals(title,sender)) {
                Person.Builder personBuilder = new Person.Builder().setKey(sender).setName(sender);
                if(msg.hasKey("image")) {
                    Bitmap bitmap = Utils.getBitmap(msg.getString("image"));
                    if(bitmap != null) {
                        IconCompat icon = IconCompat.createWithBitmap(bitmap);
                        personBuilder.setIcon(icon);
                    }
                }
                senderPerson = personBuilder.build();
            }
            style.addMessage(new NotificationCompat.MessagingStyle.Message(message,time,senderPerson));
        }
        recoveredBuilder.setStyle(style);
        NotificationManagerCompat.from(context).notify(notificationId,recoveredBuilder.build());
    }

    @Nullable
    public static Bitmap getBitmap(String src) {
        try {
            URL url = new URL(src);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream is = connection.getInputStream();
            return BitmapFactory.decodeStream(is);
        } catch(Throwable e) {
            return null;
        }
    }

    /*public static boolean isAppInForeground(Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        if(am == null) return false;

        List<ActivityManager.RunningAppProcessInfo> appProcess =
            am.getRunningAppProcesses();
        if(appProcess == null) return false;

        final String packageName = context.getPackageName();
        for(ActivityManager.RunningAppProcessInfo process: appProcess) {
            if(process.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
            && process.processName.equals(packageName)) {
                ReactContext reactContext;
                try {
                    reactContext = (ReactContext) context;
                } catch (ClassCastException ignored) {
                    return true;
                }

                return reactContext.getLifecycleState() == LifecycleState.RESUMED;
            }
        }
        return false;
    }*/
}
