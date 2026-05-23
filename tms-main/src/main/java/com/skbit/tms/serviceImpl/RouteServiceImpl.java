package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.Route;
import com.skbit.tms.exception.AlreadyExistsException;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.RouteRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.RouteService;
@Service
public class RouteServiceImpl implements RouteService {

	
	@Autowired
	private RouteRepo routeRepo;
	
	@Override
	public List<Route> getRoutes() {
		return routeRepo.findAll();
	}

	@Override
	public ApiResponse addRoute(Route route,String currentUser) {
		Route route1=routeRepo.findByRoute(route.getRoute());
		if (route1!=null) {
			throw new AlreadyExistsException("route already exists");
		}
	    route.setCreateBy(currentUser);
		route.setDate(LocalDate.now());
		 routeRepo.save(route);
		 return ApiResponse.builder().status(true).message("route created successfully").build();
	}

	@Override
	public ApiResponse update(Route route) {
		Route route1=routeRepo.findById(route.getId()).get();
		route.setCreateBy(route1.getCreateBy());
		route.setDate(route1.getDate());
		routeRepo.save(route);
		return ApiResponse.builder().status(true).message("route updated successfully").build();
	}

	@Override
	public ApiResponse delete(Long id) {
		Route route=getRouteById(id);
		routeRepo.delete(route);
		return ApiResponse.builder().status(true).message("route updated successfully").build();
		
	}

	@Override
	public Route getRouteById(Long id) {
		
		Route route=routeRepo.findById(id).get();
		if (route==null) {
			throw new NotFoundException("route not found with given id"+id);
		}else {
			return route;
			
		}
	}

}
