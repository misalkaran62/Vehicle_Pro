package com.skbit.tms.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Branch {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@NotNull(message = "branchName cannot be null")
	@NotBlank(message = "branchName cannot be blank")
	@Pattern(regexp = "[a-zA-Z ]+",message = "Branch name should be alphabetic")
	private String branchName;
	
	@NotNull(message = "branchContactPerson cannot be null")
	@NotBlank(message = "branchContactPerson cannot be blank")
	@Pattern(regexp = "[a-zA-Z ]+",message = "Branch contact person should be alphabetic")
	private String branchContactPerson;
	
	@NotNull(message = "branchContactPersonMobile cannot be null")
	@NotBlank(message = "branchContactPersonMobile cannot be blank")
	@Pattern(regexp = "[6-9]{1}[0-9]{9}",message = "Mobile number should be a 10-digit number starting with 6, 7, 8, or 9")
	private String branchContactPersonMobile;
	
	@NotNull(message = "branchLocation cannot be null")
	@NotBlank(message = "branchLocation cannot be blank")
	@Pattern(regexp = "[a-zA-Z ]+",message = "Branch location should be alphabetic")
	private String branchLocation;
	 


}
