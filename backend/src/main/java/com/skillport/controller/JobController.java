package com.skillport.controller;

import com.skillport.model.Job;
import com.skillport.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id, @RequestParam(required = false) boolean incrementView) {
        return jobRepository.findById(id).map(job -> {
            if (incrementView) {
                job.setViews((job.getViews() == null ? 0 : job.getViews()) + 1);
                jobRepository.save(job);
            }
            return job;
        }).orElse(null);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public List<Job> getJobsByRecruiter(@PathVariable Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
    }
}