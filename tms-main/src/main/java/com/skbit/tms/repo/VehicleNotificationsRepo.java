package com.skbit.tms.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.Trip;
import com.skbit.tms.entity.VehicleNotification;

public interface VehicleNotificationsRepo extends JpaRepository<VehicleNotification, Long>{

	List<VehicleNotification> findByBranchId(long id);
	
	boolean existsByDocumentIdAndTypeAndExpired(Long documentId, String type, boolean expired);
	
	boolean existsByDocumentIdAndTypeAndDistLimitReached(Long documentId, String type,boolean distLimitReached);


}
