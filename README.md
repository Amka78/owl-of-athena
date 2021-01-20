# Owl-Of-Athena
Cross-platform EEG Headband client software.
## Please read this first.
### What is Owl of Athena?

Have you heard of [iWinks' Aurora EEG headband](https://sleepwithaurora.com/) for lucid dreaming?  
The device and Windows and IOS apps have been released after an Kickstarter fundraiser four years ago.  
However, the promised Android version has yet to be released, and iWinks doesn't seem to be particularly active these days.  
I'm an Android user and I can't use Aurora as it is now. So I decided to make an open source version of Aurora client software using [SDK]() published by iWinks.  
The app is built in React Native and currently only works on the web, but I hope to eventually make it work in a variety of environments including Android, IOS and Windows.

### Current Situation
The web version was already working to a certain extent, but since the iWinks API has been shut down, I'm currently modifying the app to work without the API.
Once the standalone version is complete, I'll be adding functionality to make it work on other platforms.

### Future Plans
In the meantime, I want to make the functions of the originally existing Windows and IOS applications available to OOA.

If iWinks becomes active again, I would like to collaborate with them to improve Aurora's functionality, but if this is not possible, I would like to create a community version of the Aurora firmware or make it possible to control other EEG headbands (like Muse for example) or open source EEG headbands using Rasberry PIE, etc. with OOA.

### I want to help, how can I do it?
At the moment, OOA is being developed completely by myself. There are many ways to help.

Participate in the development, maintain the documentation (I'm not a native English speaker, so I'm sure there will be many grammatical errors).  
Star on Github, If you would like to sponsor me, I may be able to develop OOA full time.  
Programmers and non-programmers alike are welcome to help in various ways.

## For Developers
### How to build

1. [See the link to build the Expo-CLI environment.](https://docs.expo.io/get-started/installation/)

2. [See the link to install noble dependencies.](https://github.com/noble/noble)
3. Go to the root directory and execute the following command.

      ```
      npm install
### How to Run(Web)

1. Go to the root directory and execute the following command.

      ```
      npm run web

### How to Run(Expo)

1. Go to the root directory and execute the following command.

    ```
    npm run expo 

2. Load Expo URL in your terminal or emulator.