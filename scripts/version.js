const plist = require('plist');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

const IOS_PROJECT_DIR = path.join('ios', 'epension');
const PLIST_FILE = 'Info.plist';
const PLIST_VERSION_STRING_PARAM = 'CFBundleShortVersionString';
const PLIST_BUNDLE_VERSION_PARAM = 'CFBundleVersion';
const PACKAGE_JSON_VERSION_PARAM = packageJson.version;

function increaseVersion (version) {
  if ( !semver.valid(version)) throw new Error('Wrong Version, use semver valid version');
  let parsedPlist;

  try {
    parsedPlist = plist.parse(fs.readFileSync(path.join(IOS_PROJECT_DIR, PLIST_FILE), 'utf8'));
  } catch (e) {
    throw new Error(e);
  }

  if ( typeof parsedPlist == 'object') {
    parsedPlist[PLIST_BUNDLE_VERSION_PARAM] = version;
    parsedPlist[PLIST_VERSION_STRING_PARAM] = version;

    fs.writeFileSync(path.join(IOS_PROJECT_DIR, PLIST_FILE), plist.build(parsedPlist));
  }

  fs.writeFileSync('./version.json', `{ "version": ${PACKAGE_JSON_VERSION_PARAM}}`);
}

increaseVersion(PACKAGE_JSON_VERSION_PARAM);
