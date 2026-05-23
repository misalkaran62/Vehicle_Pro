package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.VehicleDescription;

public interface VehicleDescriptionRepo extends JpaRepository<VehicleDescription, Long>{

}
