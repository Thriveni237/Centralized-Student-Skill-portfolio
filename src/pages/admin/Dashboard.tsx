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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { api } from '@/lib/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '0', icon: Users, trend: '0%', up: true },
    { label: 'Active Portfolios', value: '0', icon: GraduationCap, trend: '0%', up: true },
    { label: 'Recruiter Views', value: '0', icon: TrendingUp, trend: '0%', up: true },
    { label: 'Placements', value: '0', icon: Briefcase, trend: '0%', up: true },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await api.get('/users');
        const studentCount = Array.isArray(users) ? users.filter((u: any) => u.role === 'student').length : 0;
        
        setStats([
          { label: 'Total Students', value: studentCount.toString(), icon: Users, trend: '0%', up: true },
          { label: 'Active Portfolios', value: studentCount.toString(), icon: GraduationCap, trend: '0%', up: true },
          { label: 'Recruiter Views', value: '0', icon: TrendingUp, trend: '0%', up: true },
          { label: 'Placements', value: '0', icon: Briefcase, trend: '0%', up: true },
        ]);
      } catch (error) {
        console.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <>
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

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Student Growth & Placements</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground italic">No data available for charts yet.</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Recruiter Engagement</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground italic">No data available for charts yet.</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;