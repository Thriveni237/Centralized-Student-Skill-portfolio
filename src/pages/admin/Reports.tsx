"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Download, Filter, TrendingUp, Users, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const placementData = [
  { name: '2020', rate: 65 },
  { name: '2021', rate: 72 },
  { name: '2022', rate: 78 },
  { name: '2023', rate: 85 },
];

const skillData = [
  { name: 'React', value: 400 },
  { name: 'Python', value: 300 },
  { name: 'UI/UX', value: 300 },
  { name: 'Node.js', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Reports = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Placement Reports</h1>
            <p className="text-muted-foreground">Detailed analytics on student success and recruiter engagement.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="opacity-80 text-sm">Avg. Salary Package</p>
                <p className="text-2xl font-bold">$85,000</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="opacity-80 text-sm">Placement Rate</p>
                <p className="text-2xl font-bold">82.4%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-indigo-600 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="opacity-80 text-sm">Top Recruiter</p>
                <p className="text-2xl font-bold">Google</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Placement Trends (Yearly)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5}} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6, fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {skillData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;