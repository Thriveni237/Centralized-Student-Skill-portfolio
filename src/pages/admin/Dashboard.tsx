"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '0', icon: Users, trend: '0%', up: true },
    { label: 'Active Portfolios', value: '0', icon: GraduationCap, trend: '0%', up: true },
    { label: 'Recruiter Views', value: '0', icon: TrendingUp, trend: '0%', up: true },
    { label: 'Total Applications', value: '0', icon: Briefcase, trend: '0%', up: true },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [users, jobs] = await Promise.all([
        api.get('/users'),
        api.get('/jobs')
      ]);
      
      const studentCount = Array.isArray(users) ? users.filter((u: any) => u.role === 'student').length : 0;
      const totalViews = Array.isArray(users) ? users.reduce((acc: number, u: any) => acc + (u.views || 0), 0) : 0;
      const totalApps = Array.isArray(jobs) ? jobs.reduce((acc: number, j: any) => acc + (j.applicants || 0), 0) : 0;
      
      setStats([
        { label: 'Total Students', value: studentCount.toString(), icon: Users, trend: '+12%', up: true },
        { label: 'Active Portfolios', value: studentCount.toString(), icon: GraduationCap, trend: '+5%', up: true },
        { label: 'Recruiter Views', value: totalViews.toString(), icon: TrendingUp, trend: '+18%', up: true },
        { label: 'Total Applications', value: totalApps.toString(), icon: Briefcase, trend: '+24%', up: true },
      ]);
    } catch (error) {
      console.error("Failed to fetch admin stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Institution Overview</h1>
          <p className="text-muted-foreground">Monitor student progress and recruiter engagement.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none shadow-sm bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-emerald-500' : 'text-destructive'}`}>
                      {stat.trend}
                      {stat.up ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;