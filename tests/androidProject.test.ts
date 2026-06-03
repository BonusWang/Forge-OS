import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const read = (filePath: string) => fs.readFileSync(path.join(repoRoot, filePath), 'utf-8');

test('Android project bundles Vite assets through a WebView app shell', () => {
  const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> };
  const manifest = read('android/app/src/main/AndroidManifest.xml');
  const appGradle = read('android/app/build.gradle');
  const mainActivity = read('android/app/src/main/java/com/forgeos/app/MainActivity.java');
  const buildScript = read('scripts/run-android-build.mjs');

  assert.match(pkg.scripts['android:build'], /run-android-build\.mjs/);
  assert.match(pkg.scripts['android:install'], /run-android-install\.mjs/);
  assert.match(buildScript, /JAVA_HOME/);
  assert.match(buildScript, /17/);
  assert.match(manifest, /android\.permission\.INTERNET/);
  assert.match(manifest, /com\.forgeos\.app\.MainActivity/);
  assert.match(appGradle, /buildWebAssets/);
  assert.match(appGradle, /syncWebAssets/);
  assert.match(appGradle, /androidx\.webkit:webkit/);
  assert.match(mainActivity, /WebViewAssetLoader/);
  assert.match(mainActivity, /https:\/\/appassets\.androidplatform\.net\/assets\/web\/index\.html/);
});

test('Android app exposes private file storage instead of relying on WebView localStorage', () => {
  const mainActivity = read('android/app/src/main/java/com/forgeos/app/MainActivity.java');
  const platformStorage = read('src/utils/platformStorage.ts');
  const types = read('src/types/index.ts');

  assert.match(mainActivity, /addJavascriptInterface\(new AndroidStorageBridge/);
  assert.match(mainActivity, /getFilesDir\(\)/);
  assert.match(mainActivity, /alo-data\.json/);
  assert.match(platformStorage, /window\.androidStorage/);
  assert.match(platformStorage, /createAndroidStorage/);
  assert.match(types, /androidStorage\?:/);
});

test('Android launcher icon uses the ALO pixel logo mipmap assets', () => {
  const manifest = read('android/app/src/main/AndroidManifest.xml');

  assert.match(manifest, /android:icon="@mipmap\/ic_launcher"/);
  for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
    assert.ok(
      fs.existsSync(path.join(repoRoot, `android/app/src/main/res/mipmap-${density}/ic_launcher.png`)),
      `missing ${density} launcher icon`
    );
  }
});
