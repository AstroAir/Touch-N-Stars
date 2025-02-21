package com.TouchNStars.dev;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.ref.WeakReference;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class UpdateChecker {
    private Activity context;
    private static final String GITHUB_RELEASES_URL = "https://api.github.com/repos/Touch-N-Stars/Touch-N-Stars/releases/latest";
    private static final String APK_DOWNLOAD_URL_TEMPLATE = "https://github.com/Touch-N-Stars/Touch-N-Stars/releases/download/v%s/TouchNStars-%s.apk";
    public static final int INSTALL_REQUEST_CODE = 1001;
    public static final int REQUEST_INSTALL_PERMISSION = 1002;

    public UpdateChecker(Activity context) {
        this.context = context;
    }

    public void checkForUpdate(String currentVersion) {
        new CheckUpdateTask(context, currentVersion).execute();
    }

    private static class CheckUpdateTask extends AsyncTask<Void, Void, String> {
        private WeakReference<Activity> activityRef;
        private String currentVersion;
        private OkHttpClient client = new OkHttpClient();

        CheckUpdateTask(Activity context, String currentVersion) {
            this.activityRef = new WeakReference<>(context);
            this.currentVersion = currentVersion;
        }

        @Override
        protected String doInBackground(Void... voids) {
            try {
                // Check GitHub connectivity first
                Request pingRequest = new Request.Builder()
                    .url("https://github.com")
                    .head()
                    .build();

                Response pingResponse = client.newCall(pingRequest).execute();
                if (!pingResponse.isSuccessful()) return null;

                // Get latest release info
                Request releaseRequest = new Request.Builder()
                    .url(GITHUB_RELEASES_URL)
                    .build();

                Response releaseResponse = client.newCall(releaseRequest).execute();
                String json = releaseResponse.body().string();
                String latestVersion = json.split("\"tag_name\":\"v")[1].split("\"")[0];
                
                return latestVersion.compareTo(currentVersion) > 0 ? latestVersion : null;
            } catch (IOException e) {
                return null;
            }
        }

        @Override
        protected void onPostExecute(String latestVersion) {
            Activity activity = activityRef.get();
            if (activity != null && latestVersion != null) {
                showUpdateDialog(activity, latestVersion);
            }
        }

        private void showUpdateDialog(Activity activity, String newVersion) {
            new AlertDialog.Builder(activity)
                .setTitle("New Update Available")
                .setMessage("Version " + newVersion + " is available. Download now?")
                .setPositiveButton("Download", (dialog, which) -> 
                    downloadAndInstallApk(activity, newVersion))
                .setNegativeButton("Later", null)
                .show();
        }

        private void downloadAndInstallApk(Activity activity, String version) {
            new AsyncTask<Void, Void, File>() {
                @Override
                protected File doInBackground(Void... voids) {
                    try {
                        String apkUrl = String.format(APK_DOWNLOAD_URL_TEMPLATE, version, version);
                        Request request = new Request.Builder().url(apkUrl).build();
                        Response response = client.newCall(request).execute();

                        File downloadsDir = activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                        File apkFile = new File(downloadsDir, "TouchNStars-" + version + ".apk");

                        FileOutputStream fos = new FileOutputStream(apkFile);
                        fos.write(response.body().bytes());
                        fos.close();

                        return apkFile;
                    } catch (IOException e) {
                        return null;
                    }
                }

                @Override
                protected void onPostExecute(File apkFile) {
                    if (apkFile != null) {
                        Uri apkUri = FileProvider.getUriForFile(activity,
                            "com.TouchNStars.dev.provider",
                            apkFile);

                        // Check if we need to request installation permissions
                        if (activity.getPackageManager().canRequestPackageInstalls()) {
                            Intent installIntent = new Intent(Intent.ACTION_VIEW);
                            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            activity.startActivityForResult(installIntent, INSTALL_REQUEST_CODE);
                        } else {
                            // Request the unknown app sources permission
                            Intent permissionIntent = new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                            permissionIntent.setData(Uri.parse("package:" + activity.getPackageName()));
                            activity.startActivityForResult(permissionIntent, REQUEST_INSTALL_PERMISSION);
                        }
                    }
                }
            }.execute();
        }
    }
}
