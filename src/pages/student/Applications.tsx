"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const Applications = () => {
  const { user, isDemo } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await api.get(`/applications/student/${user.id}`);
      setApplications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      if (!isDemo) showError(error.message);
      if (isDemo) {
        setApplications([
          {
            id: '1',
            jobTitle: 'Frontend Developer Intern',
            companyName: 'TechFlow Solutions',
            appliedAt: new Date().toISOString(),
            status: 'Interviewing'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interviewing': return 'bg-blue-500/10 text-blue-500';
      case 'pending': return 'bg-amber-500/10 text-amber-500';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      case 'accepted': return 'bg-emerald-500/10 text-emerald-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job and internship applications.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.length > 0 ? applications.map((app) => (
              <Card key={app.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{app.jobTitle}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {app.companyName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> 
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge className={cn("font-medium px-3 py-1 border-none", getStatusColor(app.status))}>
                        {app.status}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">You haven't applied for any jobs yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;