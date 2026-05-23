package com.skbit.tms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class InsuranceCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank(message = "Company name is required")
    @Pattern(regexp = "[a-zA-z]+", message = "alphabetic")
    @Size(max = 100, message = "Company name should not exceed 100 characters")
    private String companyName;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits")
    private String contactNumber;

    @NotBlank(message = "Contact person name is required")
    @Pattern(regexp = "[a-zA-z]+", message = "alphabetic")
    @Size(max = 50, message = "Contact person name should not exceed 50 characters")
    private String contactPersonName;

    @NotBlank(message = "ContactPerson number is required")
    @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits")
    private String contactPersonNumber;

}
