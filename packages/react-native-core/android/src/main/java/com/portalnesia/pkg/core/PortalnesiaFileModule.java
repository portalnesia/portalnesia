package com.portalnesia.pkg.core;

import android.app.Activity;
import android.app.DownloadManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.UriPermission;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PortalnesiaFileModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "PortalnesiaFile";
    private final HashMap<Long,ReadableMap> completedMap = new HashMap<>();

    private final ReactApplicationContext reactContext;

    PortalnesiaFileModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public void initialize() {
        reactContext.registerReceiver(onDownloadComplete,new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
        reactContext.registerReceiver(onDownloadNotificationClick,new IntentFilter(DownloadManager.ACTION_NOTIFICATION_CLICKED));
    }

    @Override
    public void onCatalystInstanceDestroy() {
        reactContext.unregisterReceiver(onDownloadComplete);
        reactContext.unregisterReceiver(onDownloadNotificationClick);
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void getRealPathFromSaf(String saf, Promise promise){
        try {
            Uri uri = Uri.parse(saf);
            Uri docUri = DocumentsContract.buildDocumentUriUsingTree(uri,DocumentsContract.getTreeDocumentId(uri));
            String path = getPath(reactContext,docUri);
            promise.resolve(path);
        } catch(Throwable e) {
            promise.reject("PortalnesiaFileError",e);
        }
    }

    @ReactMethod
    public void getUriPermission(Promise promise) {
        try {
            List<UriPermission> uris = reactContext.getContentResolver().getPersistedUriPermissions();
            WritableNativeArray result = new WritableNativeArray();
            for(UriPermission uri : uris) {
                result.pushString(uri.getUri().toString());
            }
            promise.resolve(result);
        } catch(Throwable e) {
            promise.reject("PortalnesiaFileError",e);
        }
    }

    @ReactMethod
    public void removeUriPermission(String saf, Promise promise) {
        try {
            Uri uri = Uri.parse(saf);
            reactContext.getContentResolver().releasePersistableUriPermission(uri,Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("PortalnesiaFileError",e);
        }
    }

    @ReactMethod
    public void openFolder(String location,Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if(activity == null) {
                return;
            }
            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri uri = Uri.parse(location);
            intent.setDataAndType(uri,"*/*");
            activity.startActivity(intent);
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("PortalnesiaFileError",e);
        }
    }

    /**
     * {
     *     title,
     *     description,
     *     uri,
     *     destination {
     *         type,
     *         path
     *     },
     *     header [
     *      [header,value]
     *     ],
     *     mimeType,
     *     channel_id
     * }
     *
     */
    @ReactMethod
    public void download(ReadableMap options, Promise promise) {
        if(!options.hasKey("uri") || !options.hasKey("destination") || !options.hasKey("mimeType")) {
            promise.reject("PortalnesiaFileError","Invalid options");
            return;
        }
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(options.getString("uri")));
        String title = "Portalnesia";
        if(options.hasKey("title")) {
            title = options.getString("title");
        }
        request.setTitle(title);
        if(options.hasKey("description")) {
            String desc = options.getString("description");
            assert desc != null;
            request.setDescription(desc);
        }
        
        request.setMimeType(options.getString("mimeType"));
        if(options.hasKey("headers")) {
            ReadableArray headers = options.getArray("headers");
            // Foreach headers
            if (headers != null) {
                for(int i = 0; i< headers.size(); i++) {
                    ReadableArray header = headers.getArray(i);
                    assert header != null;
                    request.addRequestHeader(header.getString(0),header.getString(1));
                }
            }
        }
        ReadableMap dest = options.getMap("destination");
        assert dest != null;
        String dirType = dest.getString("type");
        String path = dest.getString("path");
        request.setDestinationInExternalPublicDir(dirType,path);
        DownloadManager dm = (DownloadManager) reactContext.getSystemService(Context.DOWNLOAD_SERVICE);
        Long downloadID = dm.enqueue(request);
        completedMap.put(downloadID,options);
        promise.resolve(downloadID.doubleValue());
    }

    @Override
    public Map<String,Object> getConstants() {
        HashMap<String,Object> constants = new HashMap<>();
        constants.put("DIRECTORY_DOWNLOADS",Environment.DIRECTORY_DOWNLOADS);
        constants.put("DIRECTORY_MOVIES",Environment.DIRECTORY_MOVIES);
        constants.put("DIRECTORY_PICTURES",Environment.DIRECTORY_PICTURES);
        constants.put("DIRECTORY_MUSIC",Environment.DIRECTORY_MUSIC);
        return constants;
    }

    private final BroadcastReceiver onDownloadComplete = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID,-1);
            if(completedMap.containsKey(id)) {
                ReadableMap options = completedMap.get(id);
                assert options != null;
                if(options.hasKey("channel_id")) {
                    String channel_id = options.getString("channel_id");
                    assert channel_id != null;
                    NotificationCompat.Builder builder = new NotificationCompat.Builder(context,channel_id);
                    builder.setSmallIcon(R.mipmap.ic_portalnesia_notification_icon);
                    int color = context.getResources().getColor(R.color.portalnesia_notification_color);
                    builder.setColor(color);
                    Intent openDownload = getDownloadedIntent(context,id);
                    if(openDownload == null) {
                        openDownload = new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS);
                    }
                    openDownload.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    builder.setContentIntent(PendingIntent.getActivity(context,0,openDownload,PendingIntent.FLAG_CANCEL_CURRENT));
                    builder.setAutoCancel(true);
                    builder.setSilent(false);
                    builder.setPriority(NotificationCompat.PRIORITY_DEFAULT);
                    if(options.hasKey("title")) {
                        String title = options.getString("title");
                        builder.setContentTitle(title);
                    }
                    builder.setContentText("Download completed");
                    NotificationManagerCompat manager = NotificationManagerCompat.from(context);
                    manager.notify(id.intValue(),builder.build());
                }
                completedMap.remove(id);
            }
        }
    };

    private final BroadcastReceiver onDownloadNotificationClick = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            try {
                Intent new_intent = new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS);
                new_intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(new_intent);
            } catch(Throwable ignored) {

            }
        }
    };

    @Nullable
    private Intent getDownloadedIntent(final Context context,final Long id) {
        DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
        DownloadManager.Query query = new DownloadManager.Query().setFilterById(id);
        Cursor cursor = dm.query(query);
        if(cursor.moveToFirst()) {
            int status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS));
            String localUri = cursor.getString(cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI));
            String mimeType = cursor.getString(cursor.getColumnIndex(DownloadManager.COLUMN_MEDIA_TYPE));
            if((status == DownloadManager.STATUS_SUCCESSFUL) && localUri != null) {
                Uri uri = Uri.parse(localUri);
                if(ContentResolver.SCHEME_FILE.equals(uri.getScheme())) {
                    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        File file = new File(uri.getPath());
                        String provider = context.getPackageName() + ".PortalnesiaFilesProvider";
                        uri = FileProvider.getUriForFile(context,provider,file);
                    }
                    Intent open = new Intent(Intent.ACTION_VIEW);
                    open.setDataAndType(uri,mimeType);
                    open.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    return open;
                }
            }
        }
        cursor.close();
        return null;
    }

    public static String getPath(final Context context, final Uri uri) {
        if(DocumentsContract.isDocumentUri(context,uri)) {
            if(isExternalStorageDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                if("primary".equals(type)) {
                    return Environment.getExternalStorageDirectory() + "/" + split[1];
                }
            }
            else if(isDownloadsDocument(uri)) {
                final String id = DocumentsContract.getDocumentId(uri);
                final Uri contentUri = ContentUris.withAppendedId(
                        Uri.parse("content://downloads/public_downloads"),Long.parseLong(id)
                );
                return getDataColumn(context,contentUri,null,null);
            }
            else if(isMediaDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];
                Uri contentUri = null;
                if("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                final String selection = "_id=?";
                final String[] selectionArgs = new String[] {
                        split[1]
                };
                return getDataColumn(context,contentUri,selection,selectionArgs);
            }
        }
        // MediaStore
        else if("content".equalsIgnoreCase(uri.getScheme())) {
            if(isGooglePhotosUri(uri)) {
                return uri.getLastPathSegment();
            }
            return getDataColumn(context,uri,null,null);
        }
        //File
        else if("file".equalsIgnoreCase(uri.getScheme())) {
            return uri.getPath();
        }
        return null;
    }

    public static String getDataColumn(Context context,Uri uri, String selection,String[] selectionArgs) {
        Cursor cursor=null;
        final String column = "_data";
        final String[] projection = {
                column
        };
        try {
            cursor = context.getContentResolver().query(uri,projection,selection,selectionArgs,null);
            if(cursor != null && cursor.moveToFirst()) {
                final int index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(index);
            }
        } finally {
            if(cursor!=null) {
                cursor.close();
            }
        }
        return null;
    }

    public static boolean isExternalStorageDocument(Uri uri){
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    public static boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    public static boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    public static boolean isGooglePhotosUri(Uri uri) {
        return "com.google.android.apps.photos.content".equals(uri.getAuthority());
    }
}