package com.suprema.acandroid;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.suprema.acandroid.module.MobSMSModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by xuleyuan on 2017/9/24
 */

public class SMSPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new MobSMSModule(reactContext));

        return modules;
    }

}
