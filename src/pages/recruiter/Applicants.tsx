"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, CheckCircle2, XCircle, Loader2, User } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const Applicants = () => {
  const { jobId } = useParams();
  const { isDemo } = useAuth();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("Job Posting");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setApplicants([
          {
            id: '1',
            status: 'Pending',
            student: {
              firstName: 'Alex',
              lastName: 'Johnson',
              email: 'alex.j@university.edu',
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
            }
          }
        ]);
        setLoading(false);
        return;
      }

      // 1. Fetch the job details to get the title
      const job = await api.get(`/jobs`);
      const currentJob = Array.isArray(job) ? job.find(j => String(j.id) === jobId) : null;
      if (currentJob) setJobTitle(currentJob.title);

      // 2. Fetch applications for this job
      const apps = await api.get(`/applications/job/${jobId}`);
      
      if (Array.isArray(apps) && apps.length > 0) {
        // 3. Fetch student profiles for each application
        const enrichedApps = await Promise.all(apps.map(async (app: any) => {
          try {
            const student = await api.get(`/users/${app.studentId}`);
            return { ...app, student };
          } catch (e) {
            return { ...app, student: { firstName: 'Unknown', lastName: 'User', email: 'N/A' } };
          }
        }));
        setApplicants(enrichedApps);
      } else {
        setApplicants([]);
      }
    } catch (error: any) {
      showError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId: string, name: string, newStatus: string) => {
    try {
      if (!isDemo) {
        await api.put(`/applications/${appId}/status`, newStatus);
      }
      showSuccess(`${newStatus} ${name}`);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (error: any) {
      showError("Failed to update status");
    }
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/recruiter/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applicants</h1>
            <p className="text-slate-500 dark:text-slate-400">Reviewing candidates for {jobTitle}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : applicants.length > 0 ? (
          <div className="grid gap-4">
            {applicants.map((app) => (
              <Card key={app.id} className="border-none shadow-sm dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border">
                        <AvatarImage src={app.student?.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {app.student?.firstName?.[0]}{app.student?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {app.student?.firstName} {app.student?.lastName}
                        </h3>
                        <p className="text-sm text-slate-500">{app.student?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium">
                            {app.status}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/recruiter/student/${app.studentId}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <User className="w-4 h-4" /> View Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => handleStatusUpdate(app.id, app.student?.firstName, "Shortlisted")}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Shortlist
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-red-600 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(app.id, app.student?.firstName, "Rejected")}
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="w-4 h-4 mr-2" /> Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No applications received for this job yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;