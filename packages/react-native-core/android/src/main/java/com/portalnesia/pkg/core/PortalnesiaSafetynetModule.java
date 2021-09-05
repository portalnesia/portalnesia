package com.portalnesia.pkg.core;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.safetynet.SafetyNet;

public class PortalnesiaSafetynetModule extends ReactContextBaseJavaModule {
    public static String REACT_CLASS = "PortalnesiaSafetynet";

    private final ReactApplicationContext reactContext;

    public PortalnesiaSafetynetModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void isGooglePlayServicesAvailable(Promise promise) {
        if(GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(reactContext) == ConnectionResult.SUCCESS) {
            promise.resolve(true);
        }
        promise.resolve(false);
    }

    @ReactMethod
    public void getVerification(String nonceString, final Promise promise) {
        final String apiKey = reactContext.getString(R.string.portalnesia_verification_key);
        byte[] nonce = nonceString.getBytes();
        SafetyNet.getClient(reactContext).attest(nonce,apiKey)
        .addOnSuccessListener(response -> {
            String result = response.getJwsResult();
            promise.resolve(result);
        })
        .addOnFailureListener(e -> {
            if(e instanceof ApiException) {
                ApiException apiException = (ApiException) e;
                int statusCode = apiException.getStatusCode();
                promise.reject(Integer.toString(statusCode), CommonStatusCodes.getStatusCodeString(statusCode),e);
            } else {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void verifyWithRecaptcha(final Promise promise) {
        String apiKey = reactContext.getString(R.string.portalnesia_recaptcha_key);
        SafetyNet.getClient(reactContext).verifyWithRecaptcha(apiKey)
        .addOnSuccessListener(response -> {
            String token = response.getTokenResult();
            promise.resolve(token);
        })
        .addOnFailureListener(e -> {
            if(e instanceof ApiException) {
                ApiException apiException = (ApiException) e;
                int statusCode = apiException.getStatusCode();
                promise.reject(Integer.toString(statusCode), CommonStatusCodes.getStatusCodeString(statusCode),e);
            } else {
                promise.reject(e);
            }
        });
    }
}
