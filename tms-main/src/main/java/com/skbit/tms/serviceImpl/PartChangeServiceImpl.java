package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.PartChange;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.PartChangeRepo;
import com.skbit.tms.service.PartChangeService;

@Service
public class PartChangeServiceImpl implements PartChangeService {
	
	@Autowired
	private PartChangeRepo repo;

	@Override
	public void create(PartChange partChange) {
		repo.save(partChange);
		
	}

	@Override
	public void update(PartChange partChange) {
		repo.save(partChange);
		
	}

	@Override
	public void delete(Long id) {
		Optional<PartChange> change=repo.findById(id);
		if (change.isEmpty()) {
			throw new NotFoundException("part change not found with given id");
		}
		repo.delete(change.get());
		
	}

	@Override
	public PartChange getById(Long id) {
		Optional<PartChange> change=repo.findById(id);
		if (change.isEmpty()) {
			throw new NotFoundException("part change not found with given id");
		}
		return change.get();
	}

	@Override
	public List<PartChange> getAll() {
		return repo.findAll();
	}

}
