package com.TouchNStars.dev;

import android.os.Bundle;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import android.view.WindowManager;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep screen awake and wake up device
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }

        try {
            String versionName = getPackageManager()
                .getPackageInfo(getPackageName(), 0)
                .versionName;
                
            new UpdateChecker(this).checkForUpdate(versionName);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == UpdateChecker.INSTALL_REQUEST_CODE) {
            switch (resultCode) {
                case RESULT_OK:
                    Log.i("MainActivity", "Update installed successfully");
                    break;
                case RESULT_CANCELED:
                    Log.w("MainActivity", "Update installation canceled");
                    break;
                default:
                    Log.e("MainActivity", "Update installation failed with code " + resultCode);
            }
        }
    }
}
