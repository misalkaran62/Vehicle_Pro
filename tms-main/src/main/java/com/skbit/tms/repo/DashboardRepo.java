package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.Dashboard;

public interface DashboardRepo extends JpaRepository<Dashboard, Long> {

}
