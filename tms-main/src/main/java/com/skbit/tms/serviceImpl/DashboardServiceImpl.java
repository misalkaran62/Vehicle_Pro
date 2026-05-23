package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.Dashboard;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.DashboardRepo;
import com.skbit.tms.repo.TripRepo;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.DashboardService;
@Service
public class DashboardServiceImpl implements DashboardService {

	
	@Autowired
	private DashboardRepo dashboardRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	
	@Autowired

	private VehicleRepo vehicleRepo;
	
	
	@Autowired
	private TripRepo tripRepo;
	@Override
	public ApiResponse createDashboard(Dashboard dashboard) {
		
//		dashboard.setTotalUser(userRepo.count());
		
		 dashboardRepo.save(dashboard);
		 return ApiResponse.builder().status(true).message("dashboard created successfully").build();
		
	}

	@Override
	public ApiResponse updateDashboard(Dashboard dashboard) {
//		dashboard.setTotalUser(userRepo.count());
		dashboardRepo.save(dashboard);
		return  ApiResponse.builder().status(true).message("dashboard updated successfully").build();
	}

	@Override
	public List<Dashboard> getAll() {
		return dashboardRepo.findAll();
	}

	@Override
	public ApiResponse deleteDashboard(long id) {
		
		Optional<Dashboard> optional=dashboardRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("dashboard not found with given id");
		}
		dashboardRepo.delete(optional.get());
		return  ApiResponse.builder().status(true).message("dashboard created successfully").build();
	}

}
