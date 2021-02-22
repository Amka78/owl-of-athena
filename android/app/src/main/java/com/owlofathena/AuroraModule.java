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

  enum SleepState {
        INIT, CONFIGURING, SLEEPING, WAKING, AWAKE, SYNCING, SYNCING_ERROR
  } 

  private Boolean connected;
  private SleepState sleepState;
  private int batteryLevel;
  private Aurora aurora;
  private ReactApplicationContext _context;
  private Object auroraOsInfo;

  AuroraModule(ReactApplicationContext context) {
    super(context);
    this._context = context;

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

    try {
      this.aurora = Aurora.create(this._context, this::onConnectionStateChange, this::onError);

      this.aurora.connect(this::onCommandComplete);
      Log.d("AuroraModule", "execute connect.");
      this.connected = true; 

      this.setupAurora();
      promise.resolve(this.auroraOsInfo);
    }
    catch(Exception ex) {
      this.connected = false;
    }
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

  private void onCommandComplete(Command command) {

        Log.d("Command: %s", command.toString());
  }   

  private void onConnectionStateChange(final Aurora.ConnectionState newConnectionState) {

        if (newConnectionState == Aurora.ConnectionState.CONNECTED){

            //setupAurora()
        }

        //connectionState.onNext(newConnectionState)
    }

   private void onError(final Aurora.ErrorType errorType,final String errorMessage) {

    Log.d(errorType.toString(), errorMessage);
  }
  
  private void setupAurora() {

    aurora.queueCommand("os-info", (it) -> {

        if (!it.hasError()){

            auroraOsInfo = it.getResponseObject();

            //batteryLevel.onNext(auroraOsInfo.batteryLevel);

            //TODO: this can get removed when older versions of Aurora are no longer in circulation
            /*if (auroraOsInfo.version < 300000){

                aurora.useIndicationsForCommandOutput();
            }*/

            //if we are sleeping, then this is either a reconnect after
            //a crash (in which case no profile would be loaded) or
            //the aurora service restarting after kill (in which case
            //aurora should still be running profile)
            /*if (sleepState == SleepState.SLEEPING){

                //is this after android restarted the aurora fg service?
                if (auroraOsInfo.profileLoaded){

                    //all we really need to is restart profile
                    //since the events will get resubscribed to below
                    //and backup alarm should still be running
                    aurora.queueCommand(CommandProfileLoad("default.prof"));
                }
                else {

                    //TODO: make sure backup alarm is still running?
                    //aurora
                }
            }
            else {

                //we could be reconnecting from an unexpected state
                //so reset back to known configuring state
                //setSleepState(SleepState.CONFIGURING);
            }*/
        }
    });

    //enable the events we need, even though we might
    //already be subscribed
    /*aurora.enableEvents(
            EnumSet.of(
                    Event.EventType.BUTTON_MONITOR,
                    Event.EventType.BATTERY_MONITOR,
                    Event.EventType.SMART_ALARM,
                    Event.EventType.CLOCK_ALARM_FIRE,
                    Event.EventType.STIM_PRESENTED
            ),
            this::onEvent
    );*/

    //good as time as any to make sure clock is still in sync with device time
    //aurora.queueCommand(CommandTimeSync());
}
}