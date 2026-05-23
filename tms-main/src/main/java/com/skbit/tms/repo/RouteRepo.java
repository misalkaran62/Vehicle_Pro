package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.Route;

public interface RouteRepo extends JpaRepository<Route, Long> {

	Route findByRoute(String route);

}
