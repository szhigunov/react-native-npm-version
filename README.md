# react-native-npm-version
## Example of React-Native application with version from package.json and npm version bump.

Why not to simpify cross-platform app version increase flow, with only ```npm version``` command ?

This repository provides an sample application, with integrated solution to minimize amount of monkey job with handling `react-native` applications.
-----
Realization consist of few parts:
* some script `./scripts/version.js` which increase version in iOS project file `Info.plist`.
* custom npm scripts `version`.
* extended `./android/build.gradle`
* modified `./android/app/build.gradle`:
-----

### To use those solution in your project,
1. add `version` npm script to `scripts` section in your `package.json`: 
```json
{
  "scripts": {
    "version": "node ./scripts/version.js && [[ $(git status --porcelain -z | gawk '/version.json/ && /Info.plist/' ) ]] && git add version.json ios/"
  }
```
2. copy `./scripts/version.js` to your project root.
3. extend `./android/app/build.gradle` and `./android/build.gradle` with the following samples:

`./android/app/build.gradle`
```gradle
/* ... */
android {
  /* ... */
    defaultConfig {
        // Replace lines with your versionCode and versionName  with two lines below
        versionCode versionMajor * 10000 + versionMinor * 100 + versionPatch
        versionName "${versionMajor}.${versionMinor}.${versionPatch}"
        /* ... */
    }
  /* ... */
}
```

`./android/build.gradle`
```gradle
subprojects {
    ext {
        def npmVersion = getNpmVersionArray()
        versionMajor = npmVersion[0]
        versionMinor = npmVersion[1]
        versionPatch = npmVersion[2]
    }
}

def getNpmVersion() {
    def inputFile = new File("../package.json")
    def packageJson = new JsonSlurper().parseText(inputFile.text)
    return packageJson["version"]
}

def getNpmVersionArray() { // major [0], minor [1], patch [2]
    def (major, minor, patch) = getNpmVersion().tokenize('.')
    return [Integer.parseInt(major), Integer.parseInt(minor), Integer.parseInt(patch)] as int[]
}
```

-----

Based on solution by @AndrewJack [https://github.com/AndrewJack/versioning-react-native-app](https://github.com/AndrewJack/versioning-react-native-app).
See [Medium post](https://medium.com/@andr3wjack/versioning-react-native-apps-407469707661)

## Requirements

- ``` gawk ``` for macOS - used in `npm run version`
- ``` watchman ``` for macOS
- ``` node ``` higher than **4.2.0**