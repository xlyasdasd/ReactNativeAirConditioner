package com.swcrn.module;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.swcrn.MainApplication;

import cn.smssdk.EventHandler;
import cn.smssdk.SMSSDK;

/**
 * Created by xuleyuan on 2017/9/24
 */

public class MobSMSModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    private EventHandler eventHandler;

    public MobSMSModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.getCurrentActivity();
    }

    @Override
    public String getName() {
        return "AndroidMobSMS";
    }
    @ReactMethod
    public void sendSMS(String country,String phone){
        SMSSDK.getVerificationCode(country, phone);
    }

    @ReactMethod
    public void confirmSMS(String country,String phone ,String code){
        SMSSDK.submitVerificationCode(country,phone,code);
    }
    @ReactMethod
    public void registerSMS(){

        // 创建EventHandler对象
         eventHandler = new EventHandler() {
            public void afterEvent(int event, int result, Object data) {
                if (data instanceof Throwable) {
                    Throwable throwable = (Throwable)data;
                    String msg = throwable.getMessage();
//                    Toast.makeText(reactContext,msg,Toast.LENGTH_SHORT).show();
                } else {
                    switch (event){
                        case SMSSDK.EVENT_GET_VERIFICATION_CODE:
                            break;
                        case SMSSDK.EVENT_GET_CONTACTS:
                            break;
                        case SMSSDK.EVENT_SUBMIT_VERIFICATION_CODE:
                            break;
                        case SMSSDK.RESULT_COMPLETE:
                            break;
                        case SMSSDK.RESULT_ERROR:
                            break;
                    }

                }
            }
        };
        // 注册监听器
        SMSSDK.registerEventHandler(eventHandler);
    }
    @ReactMethod
    public void unRegisterSMS(){
        SMSSDK.unregisterEventHandler(eventHandler);
    }
}
