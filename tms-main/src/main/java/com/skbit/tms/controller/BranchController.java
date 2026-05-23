package com.skbit.tms.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.Branch;
import com.skbit.tms.entity.User;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.BranchService;
import com.skbit.tms.service.UserService;

@RestController
@RequestMapping("/branch")
public class BranchController {

	@Autowired
	private BranchService branchService;

	@Autowired
	private UserService userService;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createbranch(@RequestBody Branch branch) {
		return new ResponseEntity<ApiResponse>(this.branchService.createBranch(branch), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updatebranch(@RequestBody Branch branch) {
		return new ResponseEntity<ApiResponse>(this.branchService.updateBranch(branch), HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deletebranch(@RequestParam long id) {
		return new ResponseEntity<ApiResponse>(this.branchService.deleteBranch(id), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public Branch findById(@PathVariable long id) {
		return this.branchService.findById(id);
	}

	@GetMapping("/")
	public List<Branch> findall(Principal principal) {
		User regionalManager = userService.findByEmail(principal.getName());
		List<Branch> branches = new ArrayList<Branch>();
		if (regionalManager.getRoles().contains("RegionalManager")) {
			branches = regionalManager.getBranches();

		} else {
			branches = this.branchService.findAll();
		}
		return branches.stream().sorted((b1, b2) -> Long.compare(b2.getId(), b1.getId())).toList();
	}

	@GetMapping("/uniqueManReg")
	public List<Branch> findUniqueBranch(boolean manager) {
		if (manager) {
			return branchService.findUnassignedBranchesForRole("manager");
		} else {
			return branchService.findUnassignedBranchesForRole("regionalManager");
		}
	}

}
