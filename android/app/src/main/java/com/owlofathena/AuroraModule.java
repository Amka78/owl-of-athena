package com.owlofathena;

import android.Manifest;
import android.content.Context;

import java.io.Console;

import com.aurorasdk.*;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;

public class AuroraModule extends ReactContextBaseJavaModule {
  //private AVManagerInterface mAVManager;

  enum SleepState {
        INIT, CONFIGURING, SLEEPING, WAKING, AWAKE, SYNCING, SYNCING_ERROR
  } 

  private Boolean connected;
  private SleepState sleepState;
  //private int batteryLevel;

  AuroraModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "AuroraModule";
  }

  /*@ReactMethod
  public void setAuroraSound(final ReadableArray soundList) {

    //Log.d("AuroraModule","execute setAuroraSound.");
  }*/

  @ReactMethod
  public Boolean isConnected() {
    //Log.d("AuroraModule", "execute isConnected.");
    //return this.connected;
    return true;
  }

  @ReactMethod
  public Boolean isConfiguring() {

     Log.d("AuroraModule", "execute isConfiguring.");
     // return this.sleepState;
     return false;
  }

  @ReactMethod
  public void connect(final Promise promise) {

    Log.d("AuroraModule", "execute connect.");
    this.connected = false;
    //return promise.resolve(null);
  } 

  @ReactMethod
  public void disconnect(final Promise promise) {

    Log.d("AuroraModule","execute disconnect.");
    this.connected = false;
  }

  @ReactMethod
  public void executeCommand(final String command, final Promise promise) {

    Log.d("AuroraModule", "excute ExecuteCommand");
    //return promise.resolve(null);
  }

  @ReactMethod
  public void goToSleep(final ReadableMap profile, final ReadableMap settings, final Promise promise) {

    Log.d("AuroraModule", "execute goToSleep.");
    //return promise.resolve(null);
  }

  @ReactMethod
  public void setSleepState(final SleepState followingSleepState) {

    Log.d("AuroraModule", "execute setSleepState.");
  }

  @ReactMethod
  public void getUnsyncedSessions(final Promise promise) {

    Log.d("AuroraModule", "execute getUnsyncedSessions.");
      //return promise.resolve(null);
  }

  @ReactMethod
  public void readSessionContent(final ReadableMap sessions, final Promise promise ) {

    Log.d("AuroraModule", "execute readSessionContent.");
    //return promise.resolve(null);
  }

  @ReactMethod
  public void pushSessions(final ReadableMap sessions, final Promise promise) {

    Log.d("AuroraModule", "execute pushSessions.");
    //return promise.resolve(null);
  }
}