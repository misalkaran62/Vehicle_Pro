package com.skbit.tms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehiclePermit;

public interface VehiclePermitRepo extends JpaRepository<VehiclePermit, Long> {

    @Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehiclePermits vp WHERE vp.id = :permitId")
    Long findVehicleIdByPermitId(@Param("permitId") Long permitId);

	boolean existsByPermitReceiptNo(String permitReceiptNo);
}
