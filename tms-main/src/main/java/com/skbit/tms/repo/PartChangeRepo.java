package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.PartChange;

public interface PartChangeRepo extends JpaRepository<PartChange, Long> {

}
