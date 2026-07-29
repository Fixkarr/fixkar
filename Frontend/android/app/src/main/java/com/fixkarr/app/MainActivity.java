package com.fixkarr.app;

import android.app.AlertDialog;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (!isInternetAvailable()) {
            showNoInternetDialog();
        }
    }

    private boolean isInternetAvailable() {

        ConnectivityManager connectivityManager =
                (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

        if (connectivityManager == null)
            return false;

        Network network = connectivityManager.getActiveNetwork();

        if (network == null)
            return false;

        NetworkCapabilities capabilities =
                connectivityManager.getNetworkCapabilities(network);

        return capabilities != null &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void showNoInternetDialog() {

        new AlertDialog.Builder(this)
                .setTitle("No Internet Connection")
                .setMessage("Please check your internet connection and try again.")
                .setCancelable(false)

                .setPositiveButton("Retry", (dialog, which) -> {

                    if (isInternetAvailable()) {

                        recreate();

                    } else {

                        showNoInternetDialog();

                    }

                })

                .setNegativeButton("Exit", (dialog, which) -> {

                    finishAffinity();

                })

                .show();
    }
}