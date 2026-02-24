"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Briefcase, Building2, DollarSign, Clock, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const Jobs = () => {
  const { user, isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.get('/jobs');
      setJobs(Array.isArray(data) ? data : []);
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
            tags: 'React, Tailwind, TypeScript'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: any) => {
    if (isDemo) {
      showSuccess(`Application submitted for ${job.title} (Demo Mode)`);
      return;
    }

    setApplyingId(job.id);
    try {
      await api.post('/applications', {
        studentId: user.id,
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company,
        status: 'Pending'
      });
      showSuccess(`Successfully applied for ${job.title}!`);
    } catch (error: any) {
      showError(error.message || "Failed to submit application");
    } finally {
      setApplyingId(null);
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
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
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
                        <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" /> Just now</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10" 
                          onClick={() => handleApply(job)}
                          disabled={applyingId === job.id}
                        >
                          {applyingId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Now"}
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
            )) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No jobs found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;