package com.skbit.tms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehicleFinance;

public interface VehicleFinanceRepo extends JpaRepository<VehicleFinance, Long> {

    @Query("SELECT v.vehicleId FROM Vehicle v JOIN v.vehicleFinances vf WHERE vf.id = :financeId")
    Long findVehicleIdByFinanceId(@Param("financeId") Long financeId);
}
