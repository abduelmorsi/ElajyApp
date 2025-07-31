# Debug Guide for APK Issues

## How to Debug the Pharmacist Login Issue

### 1. Check Console Logs
After installing the APK, connect your device to your computer and run:
```bash
adb logcat | grep -i "pharmacist\|error\|crash"
```

### 2. Test Steps to Reproduce
1. Install the APK on your device
2. Open the app
3. Go through the onboarding/splash screens
4. Select "Pharmacist" as user type
5. Enter any credentials and tap "Sign In"
6. Note exactly what happens:
   - Does the app crash immediately?
   - Does it show a white/blank screen?
   - Does it show an error message?
   - Does it redirect to the wrong screen?

### 3. Added Debug Features
I've added console logging to help identify the issue:
- Authentication process logging
- Screen rendering logging
- Error boundaries for pharmacist screens

### 4. Potential Issues and Solutions
- **White Screen**: Usually indicates a JavaScript error in the component
- **App Crash**: Often related to missing dependencies or invalid resources
- **Wrong Screen**: Navigation logic issue
- **Network Error**: API endpoint issues (if any)

### 5. Quick Fix Attempts
If you're getting a white screen, try:
1. Force close the app completely
2. Clear app data/cache
3. Restart the device
4. Reinstall the APK

### 6. Build a New APK
After the code changes I made, rebuild the APK with:
```bash
eas build --platform android --profile preview --clear-cache
```
