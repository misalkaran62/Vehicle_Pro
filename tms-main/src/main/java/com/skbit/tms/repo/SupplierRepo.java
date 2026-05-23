package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.Supplier;

public interface SupplierRepo extends JpaRepository<Supplier, Long>{

}
