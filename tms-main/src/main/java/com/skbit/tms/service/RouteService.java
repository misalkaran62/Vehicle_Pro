package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.Route;
import com.skbit.tms.response.ApiResponse;

public interface RouteService {

	List<Route> getRoutes();

	ApiResponse addRoute(Route route,String currentUser);

	ApiResponse update(Route route);

	ApiResponse delete(Long id);

	Route getRouteById(Long id);

}
