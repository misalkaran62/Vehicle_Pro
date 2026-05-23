package com.skbit.tms.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.Trip;
import com.skbit.tms.entity.User;

public interface TripRepo extends JpaRepository<Trip, Long>{

	List<Trip> findByVehicleVehicleId(long vehicleId);

	List<Trip> findByBranchId(long id);

	List<Trip> findByUserId(long userId);

	List<Trip> findByStartDate(LocalDate startDate);

	List<Trip> findByEndDate(LocalDate endDate);
	
	@Query("SELECT t FROM Trip t JOIN t.branch b WHERE b.id IN :branchIds")
    List<Trip> findByBranches(@Param("branchIds") List<Long> branchIds);

}
