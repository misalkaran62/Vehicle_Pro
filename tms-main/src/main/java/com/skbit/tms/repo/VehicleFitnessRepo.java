package com.skbit.tms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehicleFitness;

public interface VehicleFitnessRepo extends JpaRepository<VehicleFitness, Long> {

    @Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehicleFitnesses vf WHERE vf.id = :fitnessId")
    Long findVehicleIdByFitnessId(@Param("fitnessId") Long fitnessId);

	boolean existsByFitnessReceiptNO(String fitnessReceiptNO);
}
