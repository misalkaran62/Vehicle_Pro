package com.skbit.tms.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.skbit.tms.enumProvider.LicenseType;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

//    @NotBlank(message = "Username is required")
//    @Size(max = 50, message = "Username should not exceed 50 characters")
//    @Pattern(regexp = "[a-zA-z]+", message = "alphabetic")
	private String userNname;

	@NotBlank(message = "Password is required")
	@Size(min = 8, max = 100, message = "Password should be between 8 and 100 characters")
	private String password;

	@NotBlank(message = "Email is required")
	@Email(regexp = "[a-z0-9._%+-]+@[a-z]+\\.[a-z]{2,3}", message = "email should match the pattern")
	private String email;

	@NotBlank(message = "First name is required")
	@Size(max = 50, message = "First name should not exceed 50 characters")
	@Pattern(regexp = "[a-zA-z]+", message = "first name should be alphabetic")
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Size(max = 50, message = "Last name should not exceed 50 characters")
	@Pattern(regexp = "[a-zA-z]+", message = "last name should be alphabetic")
	private String lastName;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "role")
	private Set<String> roles = new HashSet<>();

	private DriverStatus driverStatus;

	@DecimalMin(value = "6000000000", message = "Mobile number should be a 10-digit number starting with 6, 7, 8, or 9")
	@DecimalMax(value = "9999999999", message = "Mobile number should be a 10-digit number ")
	private long mobileNo;

	private boolean status;

	private LocalDate createdAt;

	private LocalDate updatedAt;

	private String driverLicenseName;

	private String aadharCardName;

	private String panCardName;
	
	private String drivingLicenseNumber;
	
	private LocalDate expiryDate;
	
	private LicenseType licenseType;

//	@OneToOne
//	private User user;

	// इथे आपण CascadeType.MERGE ॲड केले आहे ज्यामुळे TransientObjectException येणार नाही
	@ManyToMany(fetch = FetchType.EAGER, cascade = jakarta.persistence.CascadeType.MERGE)
	private List<Branch> branches;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList());
	}

	@Override
	public String getUsername() {
		return this.email;
	}

	@Override
	public String getPassword() {
		return this.password;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}