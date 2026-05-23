package com.skbit.tms.configuration;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import jakarta.servlet.http.HttpServletRequest;

@Component
@EnableWebMvc
public class SecurityConfiger {

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Autowired
	private JwtAuthentifcationFilter jwtAuthentifcationFilter;

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(new CorsConfigurationSource() {

			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				// TODO Auto-generated method stub
				CorsConfiguration cfg = new CorsConfiguration();
			       // Use allowedOriginPatterns instead of allowedOrigins to allow all origins
				   cfg.setAllowedOriginPatterns(Collections.singletonList("*")); 
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true); // Allow credentials
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);

                return cfg;

			}

		})).authorizeHttpRequests(auth -> auth.requestMatchers("/auth/login/**").permitAll().requestMatchers("/user/**").permitAll()
				.requestMatchers("/authenticate", "/v3/api-docs/**", "/swagger-resources/**", "/swagger-ui.html",
						"/swagger-ui/**", "/webjars/**")
				.permitAll()
				.requestMatchers("/auth/checkToken/**").permitAll()
				.requestMatchers("/password/forgot").permitAll()
				.requestMatchers("/password/check").permitAll()
				.anyRequest().authenticated())

				.exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.addFilterBefore(jwtAuthentifcationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();

	}

	public DaoAuthenticationProvider doAuthenticationProvider() {
		DaoAuthenticationProvider Provider = new DaoAuthenticationProvider();
		Provider.setUserDetailsService(userDetailsService);
		Provider.setPasswordEncoder(passwordEncoder());
		return Provider;

	}

	@Bean
	PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
	        throws Exception {
	    return authenticationConfiguration.getAuthenticationManager();
	}

}