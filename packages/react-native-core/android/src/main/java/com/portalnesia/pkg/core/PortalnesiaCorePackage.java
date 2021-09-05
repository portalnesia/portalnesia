// PortalnesiaCorePackage.java

package com.portalnesia.pkg.core;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PortalnesiaCorePackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new PortalnesiaCoreModule(reactContext));
        modules.add(new PortalnesiaBrightnessModule(reactContext));
        modules.add(new PortalnesiaSafetynetModule(reactContext));
        modules.add(new PortalnesiaFileModule(reactContext));
        modules.add(new PortalnesiaNotificationModule(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
