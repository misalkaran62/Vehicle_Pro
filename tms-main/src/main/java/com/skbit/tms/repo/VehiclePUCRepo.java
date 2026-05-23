package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehiclePUC;

public interface VehiclePUCRepo extends JpaRepository<VehiclePUC, Long>{
	
	@Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehiclePUCs puc WHERE puc.pucId=:pucId")
	Long findVehicleIdByPUCId(@Param("pucId") Long pucId);

	boolean existsByPucReceiptNo(String pucReceiptNo);

}
