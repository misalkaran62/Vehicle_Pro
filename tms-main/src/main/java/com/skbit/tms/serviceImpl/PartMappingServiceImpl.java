// PartMappingServiceImpl.java
package com.skbit.tms.serviceImpl;

import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.PartMappingRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.service.PartMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartMappingServiceImpl implements PartMappingService {

    @Autowired
    private PartMappingRepo partMappingRepo;
    
    @Autowired
    private VehicleRepo vehicleRepo;

    @Override
    public PartMapping save(PartMapping partMapping,Long vehicleId) {
    	Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getPartMappings().add(partMapping);
		vehicleRepo.save(vehicle);
        return partMapping;
    }

    @Override
    public PartMapping update(PartMapping partMapping) {
        if (!partMappingRepo.existsById(partMapping.getId())) {
            throw new IllegalArgumentException("PartMapping with id " + partMapping.getId() + " not found.");
        }
        return partMappingRepo.save(partMapping);
    }

    @Override
    public void deleteById(long id) {
        partMappingRepo.deleteById(id);
    }

    @Override
    public PartMapping findById(long id) {
        return partMappingRepo.findById(id).orElseThrow(() -> 
            new IllegalArgumentException("PartMapping with id " + id + " not found."));
    }

    @Override
    public List<PartMapping> findAll() {
        return partMappingRepo.findAll();
    }
}
