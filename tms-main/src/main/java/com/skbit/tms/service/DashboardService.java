package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.Dashboard;
import com.skbit.tms.response.ApiResponse;

public interface DashboardService {

	ApiResponse createDashboard(Dashboard dashboard);

	ApiResponse updateDashboard(Dashboard dashboard);

	List<Dashboard> getAll();

	ApiResponse deleteDashboard(long id);

}
