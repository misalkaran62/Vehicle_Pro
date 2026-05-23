package com.skbit.tms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehicleInsurance;

public interface VehicleInsuranceRepo extends JpaRepository<VehicleInsurance, Long> {

    @Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehicleInsurances vi WHERE vi.id = :insuranceId")
    Long findVehicleIdByInsuranceId(@Param("insuranceId") Long insuranceId);

	boolean existsByInsuranceNumber(String insuranceNumber);
}
