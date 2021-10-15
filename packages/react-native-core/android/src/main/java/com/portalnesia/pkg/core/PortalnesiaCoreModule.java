// PortalnesiaCoreModule.java

package com.portalnesia.pkg.core;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Build;
import android.os.LocaleList;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

public class PortalnesiaCoreModule extends ReactContextBaseJavaModule {
    public static String REACT_CLASS = "PortalnesiaCore";
    private final ReactApplicationContext reactContext;

    public PortalnesiaCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void isAppInstalled(String packageName, final Promise promise) {
        PackageManager pm = reactContext.getPackageManager();
        try {
            pm.getPackageInfo(packageName,0);
            promise.resolve(true);
        } catch (Throwable e) {
            promise.resolve(false);
        }
    }

    @SuppressLint("QueryPermissionsNeeded")
    @ReactMethod
    public void openDownloadManager() {
        Intent intent = new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if(intent.resolveActivity(reactContext.getPackageManager()) != null) {
            reactContext.startActivity(intent);
        }
    }

    @ReactMethod
    public void getAction(final Promise promise){
        Activity activity = getCurrentActivity();
        if(activity == null) {
            promise.reject("PortalnesiaCoreError","Activity is null");
            return;
        }
        Intent intent = activity.getIntent();
        promise.resolve(intent.getAction());
    }

    @ReactMethod 
    public void restartApp(Promise promise) {
        Activity activity = getCurrentActivity();
        if(activity == null) {
            promise.reject("PortalnesiaCoreError","Activity is null");
            return;
        }
        Intent i = reactContext.getPackageManager().getLaunchIntentForPackage(reactContext.getPackageName());
        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        promise.resolve(null);
        activity.startActivity(i);
        activity.setResult(Activity.RESULT_OK);
        activity.finish();
    }

    @Override
    public Map<String,Object> getConstants() {
        HashMap<String,Object> constants = new HashMap<>();
        constants.put("initialLocalization",getLocalizaationConstans());
        constants.put("SUPPORTED_ABIS",getSupportedAbi());
        return constants;
    }

    private final @NonNull
    BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            ReactApplicationContext reactContext = getReactApplicationContext();
            if(intent.getAction() != null &&
            reactContext.hasActiveCatalystInstance()) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("localizationChange",getLocalizaationConstans());
            }
        }
    };

    @Override
    public void initialize() {
        super.initialize();
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_LOCALE_CHANGED);
        getReactApplicationContext().registerReceiver(broadcastReceiver,filter);
    }

    /*
    PRIVATE FUNCTION
     */

    private @NonNull
    List<Locale> getLocales() {
        List<Locale> locales = new ArrayList<>();
        Configuration config = reactContext.getResources().getConfiguration();
        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            locales.add(config.locale);
        } else {
            LocaleList list = config.getLocales();
            for(int i=0;i<list.size();i++){
                locales.add(list.get(i));
            }
        }
        return locales;
    }

    private @NonNull String getLanguageCode(@NonNull Locale locale) {
        String language = locale.getLanguage();
        switch (language){
            case "iw":
                return "he";
            case "in":
                return "id";
            case "ji":
                return "yi";
        }
        return language;
    }

    private @NonNull String getCountryCode(@NonNull Locale locale) {
        try {
            String country = locale.getCountry();
            if(country.equals("419")) {
                return "UN";
            }
            return TextUtils.isEmpty(country) ? "" : country;
        } catch (Throwable ignored){
            return "";
        }
    }

    private @NonNull String getScriptCode(@NonNull Locale locale) {
        String script = locale.getScript();
        return TextUtils.isEmpty(script) ? "" : script;
    }

    private @NonNull String getSystemProperty() {
        try{
            @SuppressLint("PrivateApi") Class<?> system = Class.forName("android.os.SystemProperties");
            Method get = system.getMethod("get",String.class);
            return (String) Objects.requireNonNull(get.invoke(system,"ro.miui.region"));
        } catch (Throwable ignored){
            return "";
        }
    }

    private @NonNull String getRegionCode(@NonNull Locale locale){
        String miui = getSystemProperty();
        if(!TextUtils.isEmpty(miui)) {
            return miui;
        }
        return getCountryCode(locale);
    }

    private @NonNull String createLanguageTag(@NonNull String languageCode,@NonNull String scriptCode,@NonNull String countryCode) {
        String languageTag = languageCode;
        if(!TextUtils.isEmpty(scriptCode)) {
            languageTag += "-" + scriptCode;
        }
        return languageTag + "-" + countryCode;
    }

    private @NonNull
    WritableMap getLocalizaationConstans() {
        List<Locale> deviceLocales = getLocales();
        Locale currentLocale = deviceLocales.get(0);
        String currentRegionCode = getRegionCode(currentLocale);

        if(TextUtils.isEmpty(currentRegionCode)) {
            currentRegionCode = "US";
        }

        List<String> languageTagList = new ArrayList<>();
        WritableArray locales = Arguments.createArray();

        for(Locale deviceLocale: deviceLocales) {
            String languageCode = getLanguageCode(deviceLocale);
            String scriptCode = getScriptCode(deviceLocale);
            String countryCode = getCountryCode(deviceLocale);

            if(TextUtils.isEmpty(countryCode)) {
                countryCode = currentRegionCode;
            }

            String languageTag = createLanguageTag(languageCode,scriptCode,countryCode);
            WritableMap locale = Arguments.createMap();
            locale.putString("languageCode",languageCode);
            locale.putString("countryCode",countryCode);
            locale.putString("languageTag",languageTag);

            if(!languageTagList.contains(languageTag)) {
                languageTagList.add(languageTag);
                locales.pushMap(locale);
            }
        }

        WritableMap exported = Arguments.createMap();
        exported.putArray("locales",locales);
        exported.putString("country",currentRegionCode);
        return exported;
    }

    public @NonNull WritableArray getSupportedAbi() {
        WritableArray abis = Arguments.createArray();
        String[] textAbis = Build.SUPPORTED_ABIS;
        for(String abi: textAbis) {
            abis.pushString(abi);
        }
        return abis;
    }
}
