"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code2, FolderRoot, Award, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

const StudentDashboard = () => {
  const { user, isDemo } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    certs: 0,
    views: 142
  });
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (user && !isDemo) {
      fetchDashboardData();
    } else if (isDemo) {
      setProfile(user);
      setLoading(false);
    }
  }, [user, isDemo]);

  const fetchDashboardData = async () => {
    try {
      const profileData = await api.get(`/users/${user.id}`);
      const [skills, projects, certs] = await Promise.all([
        api.get('/skills'),
        api.get('/projects'),
        api.get('/certifications')
      ]);
      
      setProfile(profileData);
      setStats({
        skills: skills?.length || 0,
        projects: projects?.length || 0,
        certs: certs?.length || 0,
        views: 142
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const displayName = profile?.firstName || user?.firstName || 'Student';

  const statCards = [
    { label: 'Skills Added', value: stats.skills, icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Projects', value: stats.projects, icon: FolderRoot, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Certifications', value: stats.certs, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Profile Views', value: stats.views, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {displayName}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your portfolio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Overall Progress</span>
                  <span className="text-primary font-bold">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="grid gap-4">
                {[
                  { task: 'Add professional bio', done: !!profile?.bio },
                  { task: 'Upload 3+ projects', done: stats.projects >= 3 },
                  { task: 'Verify email address', done: true },
                  { task: 'Add social links', done: !!profile?.github || !!profile?.linkedin },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-accent/50">
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center",
                      item.done ? "bg-primary border-primary" : "bg-background border-muted-foreground/30"
                    )}>
                      {item.done && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                    </div>
                    <span className={cn("text-sm", item.done ? "text-foreground" : "text-muted-foreground")}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 bg-primary/20 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Profile last updated</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;