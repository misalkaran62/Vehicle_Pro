package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.UserLog;

public interface UserLogRepo extends JpaRepository<UserLog, Long>{

}
