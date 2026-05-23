package com.skbit.tms.response;

import com.skbit.tms.entity.Trip;

public class TripWithPhotosResponse {
    private Trip trip;
    private String startKmPhoto; // Base64-encoded content or URL
    private String endKmPhoto;   // Base64-encoded content or URL

    public TripWithPhotosResponse(Trip trip, String startKmPhoto, String endKmPhoto) {
        this.trip = trip;
        this.startKmPhoto = startKmPhoto;
        this.endKmPhoto = endKmPhoto;
    }

    // Getters and Setters
    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public String getStartKmPhoto() {
        return startKmPhoto;
    }

    public void setStartKmPhoto(String startKmPhoto) {
        this.startKmPhoto = startKmPhoto;
    }

    public String getEndKmPhoto() {
        return endKmPhoto;
    }

    public void setEndKmPhoto(String endKmPhoto) {
        this.endKmPhoto = endKmPhoto;
    }
}
