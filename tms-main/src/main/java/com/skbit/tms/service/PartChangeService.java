package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.PartChange;

public interface PartChangeService {

	void create(PartChange partChange);

	void update(PartChange partChange);

	void delete(Long id);

	PartChange getById(Long id);

	List<PartChange> getAll();
	

}
