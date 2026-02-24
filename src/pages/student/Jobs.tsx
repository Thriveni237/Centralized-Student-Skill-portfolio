"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Clock, 
  Loader2, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const Jobs = () => {
  const { user, isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchJobsAndApplications();
  }, []);

  const fetchJobsAndApplications = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        api.get('/jobs'),
        api.get(`/applications/student/${user.id}`)
      ]);
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      
      const appliedIds = new Set<string>(
        Array.isArray(appsData) ? appsData.map((app: any) => String(app.jobId)) : []
      );
      setAppliedJobIds(appliedIds);
    } catch (error: any) {
      if (!isDemo) showError(error.message);
      if (isDemo) {
        setJobs([
          {
            id: '1',
            title: 'Frontend Developer Intern',
            company: 'TechFlow Solutions',
            location: 'Remote',
            type: 'Internship',
            salary: '$25 - $35 / hr',
            description: 'We are looking for a passionate Frontend Intern to join our team.',
            tags: 'React, Tailwind, TypeScript',
            views: 45,
            applicants: 12
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: any) => {
    if (appliedJobIds.has(String(job.id))) return;

    setApplyingId(job.id);
    try {
      if (isDemo) {
        setTimeout(() => {
          setAppliedJobIds(prev => new Set(prev).add(String(job.id)));
          showSuccess(`Application submitted for ${job.title} (Demo Mode)`);
          setApplyingId(null);
        }, 800);
        return;
      }

      await api.post('/applications', {
        studentId: user.id,
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company,
        status: 'Pending'
      });
      
      setAppliedJobIds(prev => new Set(prev).add(String(job.id)));
      showSuccess(`Successfully applied for ${job.title}!`);
      // Refresh jobs to see updated applicant count
      fetchJobsAndApplications();
    } catch (error: any) {
      showError(error.message || "Failed to submit application");
    } finally {
      setApplyingId(null);
    }
  };

  const openDetails = async (job: any) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
    
    // Increment view count in background
    if (!isDemo) {
      try {
        await api.get(`/jobs/${job.id}?incrementView=true`);
      } catch (e) {
        console.error("Failed to increment job view");
      }
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Board</h1>
            <p className="text-muted-foreground">Discover opportunities that match your skill set.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs, companies..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => {
              const isApplied = appliedJobIds.has(String(job.id));
              
              return (
                <Card key={job.id} className="border-none shadow-sm hover:shadow-md transition-all group bg-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center shrink-0">
                          <Building2 className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4">
                        <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                          <span className="flex items-center gap-1 text-emerald-500"><DollarSign className="w-4 h-4" /> {job.salary || 'Competitive'}</span>
                          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" /> {job.applicants || 0} Applicants</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openDetails(job)} className="gap-2">
                            <Info className="w-4 h-4" /> Details
                          </Button>
                          <Button 
                            size="sm" 
                            className={isApplied 
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none" 
                              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10"
                            }
                            onClick={() => handleApply(job)}
                            disabled={applyingId === job.id || isApplied}
                          >
                            {applyingId === job.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isApplied ? (
                              <><CheckCircle2 className="w-4 h-4 mr-2" /> Applied</>
                            ) : (
                              "Apply Now"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.tags?.split(',').map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-normal">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            }) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No jobs found matching your search.</p>
              </div>
            )}
          </div>
        )}

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            {selectedJob && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold">{selectedJob.title}</DialogTitle>
                      <DialogDescription className="text-base font-medium text-primary">
                        {selectedJob.company}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {selectedJob.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" /> {selectedJob.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                      <DollarSign className="w-4 h-4" /> {selectedJob.salary || 'Competitive'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" /> {selectedJob.views || 0} Views
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">About the Role</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedJob.description || "No detailed description provided for this role."}
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                  <Button 
                    className={appliedJobIds.has(String(selectedJob.id)) 
                      ? "bg-emerald-500/10 text-emerald-600" 
                      : "bg-primary text-primary-foreground"
                    }
                    disabled={appliedJobIds.has(String(selectedJob.id)) || applyingId === selectedJob.id}
                    onClick={() => {
                      handleApply(selectedJob);
                      setIsDetailsOpen(false);
                    }}
                  >
                    {appliedJobIds.has(String(selectedJob.id)) ? "Already Applied" : "Apply for this Position"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;