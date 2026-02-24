package com.skillport.controller;

import com.skillport.model.Application;
import com.skillport.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/student/{studentId}")
    public List<Application> getStudentApplications(@PathVariable Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(@PathVariable Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @PostMapping
    public Application applyForJob(@RequestBody Application application) {
        return applicationRepository.save(application);
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestBody String status) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(status);
            return applicationRepository.save(app);
        }).orElse(null);
    }
}