package com.portalnesia.pkg.core;

import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.Person;
import androidx.core.app.RemoteInput;
import androidx.core.graphics.drawable.IconCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class PortalnesiaNotificationModule extends ReactContextBaseJavaModule {
    public static String REACT_CLASS = "PortalnesiaNotification";
    public static String REPLY_KEY = "portalnesia_reply_key";
    public static String NOTIFICATION_ACTION = "com.portalnesia.NOTIFICATION_ACTION";
    private final ReactApplicationContext reactContext;

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public PortalnesiaNotificationModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public Map<String,Object> getConstants(){
        HashMap<String,Object> constants = new HashMap<>();
        constants.put("PRIORITY_DEFAULT", NotificationCompat.PRIORITY_DEFAULT);
        constants.put("PRIORITY_HIGH", NotificationCompat.PRIORITY_HIGH);
        constants.put("PRIORITY_LOW", NotificationCompat.PRIORITY_LOW);
        constants.put("PRIORITY_MAX", NotificationCompat.PRIORITY_MAX);
        constants.put("PRIORITY_MIN", NotificationCompat.PRIORITY_MIN);
        constants.put("VISIBILITY_PRIVATE", NotificationCompat.VISIBILITY_PRIVATE);
        constants.put("VISIBILITY_PUBLIC", NotificationCompat.VISIBILITY_PUBLIC);
        constants.put("VISIBILITY_SECRET", NotificationCompat.VISIBILITY_SECRET);
        return constants;
    }

    @ReactMethod
    public void notify(final int notification_id, final String channel_id, final ReadableMap options, final Promise promise) {
        final String packageName = reactContext.getPackageName();
        NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext,channel_id);
        builder.setSmallIcon(R.mipmap.ic_portalnesia_notification_icon);
        int color = reactContext.getResources().getColor(R.color.portalnesia_notification_color);
        builder.setColor(color);

        Intent openApp = reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
        if(openApp == null) {
            openApp = new Intent();
            openApp.setPackage(packageName);
            openApp.addCategory(Intent.CATEGORY_LAUNCHER);
        }
        openApp.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if(options.hasKey("uri")) {
            openApp.setAction(Intent.ACTION_VIEW);
            openApp.setData(Uri.parse(options.getString("uri")));
        }
        builder.setContentIntent(PendingIntent.getActivity(reactContext,0,openApp,PendingIntent.FLAG_CANCEL_CURRENT));

        if(options.hasKey("autoCancel")) {
            builder.setAutoCancel(options.getBoolean("autoCancel"));
        }

        if(options.hasKey("onGoing")) {
            builder.setOngoing(options.getBoolean("onGoing"));
        }

        if(options.hasKey("silent")) {
            builder.setSilent(options.getBoolean("silent"));
        }

        if(options.hasKey("priority")) {
            builder.setPriority(options.getInt("priority"));
        }

        if(options.hasKey("visibility")) {
            builder.setVisibility(options.getInt("visibility"));
        }

        /*
          messages
           {
               title: same as messages.sender,
               label: string,
               extra: object,
               message: {
                    sender: string,
                    text: string,
                    time: int
               }[]
           }
         */
        if(options.hasKey("messages")) {
            if(Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
                promise.reject("PortalnesiaNotificationError","Require Android N");
                return;
            }
            ReadableMap msgOption = options.getMap("messages");
            if(msgOption == null) {
                promise.reject("PortalnesiaNotificationError","Invalid messages object");
                return;
            }
            String title = msgOption.getString("title");
            ReadableArray messages = msgOption.getArray("message");
            if(messages == null) {
                promise.reject("PortalnesiaNotificationError","Message array cannot be empty");
                return;
            }
            Person.Builder titleBuilder = new Person.Builder().setKey(title).setName(title);
            if(msgOption.hasKey("image")) {
                Bitmap bitmap = Utils.getBitmap(msgOption.getString("image"));
                if(bitmap != null) {
                    IconCompat icon = IconCompat.createWithBitmap(bitmap);
                    titleBuilder.setIcon(icon);
                }
            }
            Person titlePerson = titleBuilder.build();
            NotificationCompat.MessagingStyle style = new NotificationCompat.MessagingStyle(titlePerson);
            for(int i=0; i < messages.size();i++) {
                ReadableMap msg = messages.getMap(i);
                if(msg == null) {
                    promise.reject("PortalnesiaNotificationError","Message cannot be empty");
                    return;
                }
                String personName = msg.getString("sender");
                Person person;
                if(TextUtils.equals(personName,title)) {
                    person = null;
                } else {
                    Person.Builder personBuilder = new Person.Builder().setKey(personName).setName(personName);
                    if(msg.hasKey("image")) {
                        Bitmap bitmap = Utils.getBitmap(msg.getString("image"));
                        if(bitmap != null) {
                            IconCompat icon = IconCompat.createWithBitmap(bitmap);
                            personBuilder.setIcon(icon);
                        }
                    }
                    person = personBuilder.build();
                }
                style.addMessage(new NotificationCompat.MessagingStyle.Message(msg.getString("text"), msg.getInt("time"),person));
            }
            String replyLabel = msgOption.getString("label");
            RemoteInput remoteInput = new RemoteInput.Builder(REPLY_KEY).setLabel(replyLabel).build();
            Intent msgIntent = new Intent(reactContext,NotificationReceiver.class);
            msgIntent.setAction(NOTIFICATION_ACTION);
            msgIntent.putExtra("key",REPLY_KEY);
            msgIntent.putExtra("notification_id",notification_id);
            if(msgOption.hasKey("extra")) {
                Bundle extra = Arguments.toBundle(msgOption.getMap("extra"));
                msgIntent.putExtra("extra",extra);
                msgIntent.putExtras(extra);
            }
            PendingIntent replyIntent = PendingIntent.getBroadcast(reactContext,notification_id,msgIntent,PendingIntent.FLAG_UPDATE_CURRENT);
            NotificationCompat.Action replyAction = new NotificationCompat.Action.Builder(null,
                replyLabel,
                replyIntent)
                .addRemoteInput(remoteInput)
                .setAllowGeneratedReplies(true)
                .build();
            builder.addAction(replyAction);
            builder.setStyle(style);
        } else {
            if(options.hasKey("title")) {
                builder.setContentTitle(options.getString("title"));
            }

            if(options.hasKey("body")) {
                builder.setContentText(options.getString("body"));
            }

            if(options.hasKey("progress")) {
                ReadableMap progress = options.getMap("progress");
                if(progress == null || !progress.hasKey("progress") || !progress.hasKey("max") || !progress.hasKey("intermediate")) {
                    promise.reject("PortalnesiaNotificationError","Progress input invalid!");
                    return;
                }
                builder.setProgress(progress.getInt("max"),progress.getInt("progress"),progress.getBoolean("intermediate"));
            }
        }

        /*
            {
                label: string,
                key: string,
                extra: object
            }
         */
        if(options.hasKey("action")) {
            ReadableArray actionArray = options.getArray("action");
            for(int i = 0; i< Objects.requireNonNull(actionArray).size(); i++) {
                ReadableMap option = actionArray.getMap(i);
                if(option == null) {
                    promise.reject("PortalnesiaNotificationError","Invalid messages object");
                    return;
                }
                String label = option.getString("label");
                String key = option.getString("key");
                Intent actionIntent = new Intent(reactContext,NotificationReceiver.class);
                actionIntent.setAction(NOTIFICATION_ACTION);
                actionIntent.putExtra("key",key);
                actionIntent.putExtra("notification_id",notification_id);
                if(option.hasKey("extra")) {
                    Bundle extra = Arguments.toBundle(option.getMap("extra"));
                    actionIntent.putExtra("extra",extra);
                    actionIntent.putExtras(extra);
                }
                PendingIntent pendingIntent = PendingIntent.getBroadcast(reactContext,notification_id,actionIntent,PendingIntent.FLAG_UPDATE_CURRENT);
                NotificationCompat.Action action = new NotificationCompat.Action.Builder(null,
                    label,
                    pendingIntent)
                    .build();
                builder.addAction(action);
            }
        }

        if(options.hasKey("largeIcon")) {
            Bitmap bitmap = Utils.getBitmap(options.getString("largeIcon"));
            if(bitmap != null) {
                builder.setLargeIcon(bitmap);
            }
        } else if(options.hasKey("images")) {
            Bitmap bitmap = Utils.getBitmap(options.getString("images"));
            if(bitmap != null) {
                builder.setLargeIcon(bitmap);
                builder.setStyle(
                    new NotificationCompat.BigPictureStyle()
                        .bigPicture(bitmap)
                        .bigLargeIcon(null)
                );
            }
        }

        NotificationManagerCompat manager = NotificationManagerCompat.from(reactContext);
        manager.notify(notification_id,builder.build());
        promise.resolve(null);
    }

    /*
        message: {
            sender: string,
            text: string,
            time: int
       }
     */
    @ReactMethod
    public void addReplyNotification(final int notification_id,ReadableMap msgObject,final Promise promise) {
        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            promise.reject("PortalnesiaNotificationError","This function requires API level 24");
            return;
        }
        try {
            Utils.updateReply(reactContext,notification_id,msgObject);
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("PortalnesiaNotificationError",e);
        }
    }

    @ReactMethod
    public void errorReplyNotification(final int notification_id,final Promise promise) {
        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            promise.reject("PortalnesiaNotificationError","This function requires API level 24");
            return;
        }
        try {
            Utils.updateReply(reactContext,notification_id,null);
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("PortalnesiaNotificationError",e);
        }
    }

    @ReactMethod
    public void isNotificationActive(int notificationId,Promise promise) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            final boolean active = Utils.findActiveNotification(reactContext,notificationId) != null;
            promise.resolve(active);
            return;
        }
        promise.reject("PortalnesiaNotificationError","This function requires API level 24");
    }

    @ReactMethod
    public void cancel(int notification_id) {
        NotificationManagerCompat manager = NotificationManagerCompat.from(reactContext);
        manager.cancel(notification_id);
    }

    @ReactMethod
    public void cancelAll() {
        NotificationManagerCompat manager = NotificationManagerCompat.from(reactContext);
        manager.cancelAll();
    }
}
