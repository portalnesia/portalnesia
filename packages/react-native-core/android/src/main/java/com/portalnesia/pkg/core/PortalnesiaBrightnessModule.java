package com.portalnesia.pkg.core;

import android.app.Activity;
import android.provider.Settings;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PortalnesiaBrightnessModule extends ReactContextBaseJavaModule {
    public static String REACT_CLASS = "PortalnesiaBrightness";

    private final ReactApplicationContext reactContext;

    public PortalnesiaBrightnessModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void setBrightness(final float brightness) {
        final Activity activity = getCurrentActivity();
        if(activity == null) {
            return;
        }
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
                lp.screenBrightness = brightness;
                activity.getWindow().setAttributes(lp);
            }
        });
    }

    @ReactMethod
    public void getBrightness(Promise promise){
        final Activity activity = getCurrentActivity();
        if(activity == null) {
            promise.reject("PortalnesiaBrightnessError","Activity is null");
            return;
        }
        WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
        promise.resolve(lp.screenBrightness);
    }

    @ReactMethod
    public void getSystemBrightness(Promise promise){
        String brightness = Settings.System.getString(reactContext.getContentResolver(),"screen_brightness");
        promise.resolve(Integer.parseInt(brightness)/255f);
    }
}
