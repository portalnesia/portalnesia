package com.portalnesia.pkg.core;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class HeadlessNotificationServices extends HeadlessJsTaskService {
    public static final long TIMEOUT_DEFAULT = 120000;
    public static final String TASK_KEY = "PortalnesiaNotificationHeadlessTask";

    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if(extras == null) return null;
        WritableMap extra = Arguments.fromBundle(extras);
        return new HeadlessJsTaskConfig(
            TASK_KEY,
            extra,
            TIMEOUT_DEFAULT,
            true
        );
    }
}
