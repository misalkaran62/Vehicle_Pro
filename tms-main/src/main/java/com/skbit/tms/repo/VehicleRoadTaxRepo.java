package com.skbit.tms.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehicleRoadTax;

public interface VehicleRoadTaxRepo extends JpaRepository<VehicleRoadTax, Long>{
	
	
	  @Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehicleRoadTaxes vs WHERE vs.roadTaxId = :roadTaxId")
	    Long findVehicleIdByRoadTaxId(@Param("roadTaxId") Long roadTaxId);

	boolean existsByRoadTaxReceiptNo(String roadTaxReceiptNo);
}
