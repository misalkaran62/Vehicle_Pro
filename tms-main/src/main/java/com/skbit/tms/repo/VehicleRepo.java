package com.skbit.tms.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.entity.VehicleStatus;

public interface VehicleRepo extends JpaRepository<Vehicle, Long>{

	List<Vehicle> findByBranchId(long branchId);

	List<Vehicle> findByVehicleStatus(VehicleStatus available);

	Vehicle findByVehicleReg(String vehicleReg);
	// @Query("SELECT v FROM Vehicle v WHERE v.branch.id = :branchId AND v.vehicleStatus = 'AVAILABLE'")
    // List<Vehicle> findAvailableVehiclesByBranchId(long branchId);

    List<VehicleServicing> findAllServicingByVehicleId(long vehicleId);

    List<VehicleServicing> findVehicleServicingsByVehicleId(long id);
	
	@Query("SELECT pm FROM Vehicle v JOIN v.partMappings pm JOIN pm.partChange pc WHERE v.vehicleId = :vehicleId AND pc.partName = :partName")
    List<PartMapping> findPartMappingsByVehicleIdAndPartName(@Param("vehicleId") long vehicleId, @Param("partName") String partName);

	
}
