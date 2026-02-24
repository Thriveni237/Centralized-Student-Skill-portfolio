"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
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

const data = [
  { name: 'Jan', students: 400, placements: 240 },
  { name: 'Feb', students: 300, placements: 139 },
  { name: 'Mar', students: 200, placements: 980 },
  { name: 'Apr', students: 278, placements: 390 },
  { name: 'May', students: 189, placements: 480 },
  { name: 'Jun', students: 239, placements: 380 },
];

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '2,543', icon: Users, trend: '+12%', up: true },
    { label: 'Active Portfolios', value: '1,892', icon: GraduationCap, trend: '+5%', up: true },
    { label: 'Recruiter Views', value: '12.4k', icon: TrendingUp, trend: '+18%', up: true },
    { label: 'Placements', value: '432', icon: Briefcase, trend: '-2%', up: false },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Institution Overview</h1>
          <p className="text-muted-foreground">Monitor student progress and recruiter engagement.</p>
        </div>

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
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placements" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recruiter Engagement</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;