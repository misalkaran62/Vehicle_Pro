// PartMappingService.java
package com.skbit.tms.service;

import com.skbit.tms.entity.PartMapping;

import java.util.List;

public interface PartMappingService {
    PartMapping save(PartMapping partMapping,Long vehicleId);
    PartMapping update(PartMapping partMapping);
    void deleteById(long id);
    PartMapping findById(long id);
    List<PartMapping> findAll();
}
