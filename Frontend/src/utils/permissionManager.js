import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { Camera } from "@capacitor/camera";
import { LocalNotifications } from "@capacitor/local-notifications";

export const isAndroid = () => {
    return Capacitor.getPlatform() === "android";
};

// ---------------- LOCATION ----------------

export const requestLocationPermission = async () => {

    if (!isAndroid()) return true;

    try {

        const permission = await Geolocation.checkPermissions();

        if (
            permission.location === "granted" ||
            permission.coarseLocation === "granted"
        ) {
            return true;
        }

        const request = await Geolocation.requestPermissions();

        return (
            request.location === "granted" ||
            request.coarseLocation === "granted"
        );

    } catch (err) {
        console.log(err);
        return false;
    }

};

// ---------------- NOTIFICATION ----------------

export const requestNotificationPermission = async () => {

    if (!isAndroid()) return true;

    try {

        const permission = await LocalNotifications.checkPermissions();

        if (permission.display === "granted") {
            return true;
        }

        const request = await LocalNotifications.requestPermissions();

        return request.display === "granted";

    } catch (err) {
        console.log(err);
        return false;
    }

};

// ---------------- CAMERA ----------------

export const requestCameraPermission = async () => {

    if (!isAndroid()) return true;

    try {

        const permission = await Camera.checkPermissions();

        if (permission.camera === "granted") {
            return true;
        }

        const request = await Camera.requestPermissions({
            permissions: ["camera"],
        });

        return request.camera === "granted";

    } catch (err) {
        console.log(err);
        return false;
    }

};

// ---------------- GALLERY ----------------

export const requestGalleryPermission = async () => {

    if (!isAndroid()) return true;

    try {

        const permission = await Camera.checkPermissions();

        if (
            permission.photos === "granted" ||
            permission.photos === "limited"
        ) {
            return true;
        }

        const request = await Camera.requestPermissions({
            permissions: ["photos"],
        });

        return (
            request.photos === "granted" ||
            request.photos === "limited"
        );

    } catch (err) {
        console.log(err);
        return false;
    }

};