package com.skbit.tms.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripUpdateRequest {
	
	private long tripId;
	private Double startKm;
	private Double endKm;
	private String startLoc;
	private String endLoc;

}
