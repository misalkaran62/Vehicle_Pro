package com.skbit.tms.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
//	@Pattern(regexp = "[a-zA-Z]+", message = "Route must contain only alphabetic characters")
	private String route;
	private String  description;
	private LocalDate date;
	private String createBy;

}
