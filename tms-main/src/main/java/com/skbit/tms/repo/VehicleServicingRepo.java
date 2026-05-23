package com.skbit.tms.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehicleServicing;

public interface VehicleServicingRepo extends JpaRepository<VehicleServicing, Long> {

	@Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehicleServicings vs WHERE vs.servicingId = :servicingId")
	Long findVehicleIdByServicingId(@Param("servicingId") Long servicingId);

	@Query("SELECT vs FROM Vehicle v JOIN v.vehicleServicings vs WHERE v.branch.id = :branchId")
	List<VehicleServicing> findVehicleServicingsByBranchId(@Param("branchId") Long branchId);





}
