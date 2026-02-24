"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Video, 
  MoreVertical, 
  CheckCircle2, 
  CalendarDays,
  MapPin,
  Loader2,
  History,
  Plus
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const Interviews = () => {
  const { user, isDemo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      // In a real scenario, we'd fetch applications for this recruiter's jobs with status 'Interviewing'
      if (isDemo) {
        setInterviews([
          {
            id: '1',
            candidateName: 'Alex Johnson',
            role: 'Frontend Developer Intern',
            date: '2024-10-28',
            time: '10:00 AM',
            type: 'Technical Round',
            status: 'Upcoming',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
          },
          {
            id: '2',
            candidateName: 'Sarah Chen',
            role: 'UI/UX Designer',
            date: '2024-10-29',
            time: '02:30 PM',
            type: 'Culture Fit',
            status: 'Upcoming',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
          }
        ]);
      } else {
        // Fetch logic for real users
        const data = await api.get('/jobs'); 
        // Filter or fetch specific interview data here
        setInterviews([]);
      }
    } catch (error: any) {
      showError("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (name: string) => {
    showSuccess(`Interview with ${name} marked as completed`);
    setInterviews(prev => prev.filter(i => i.candidateName !== name));
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Interview Command Center</h1>
            <p className="text-slate-500">Manage your candidate pipeline and scheduled evaluations.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
            <Plus className="w-4 h-4 mr-2" /> Schedule Interview
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
            <TabsTrigger value="upcoming" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CalendarDays className="w-4 h-4" /> Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="w-4 h-4" /> Past Interviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 animate-in fade-in duration-500">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : interviews.length > 0 ? (
              interviews.map((interview) => (
                <Card key={interview.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className="w-1.5 bg-blue-600" />
                      <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                            <AvatarImage src={interview.avatar} />
                            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                              {interview.candidateName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {interview.candidateName}
                            </h3>
                            <p className="text-sm font-medium text-blue-600">{interview.role}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</span>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-normal h-5">
                                {interview.type}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Calendar className="w-4 h-4 text-blue-500" /> 
                              {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-4 h-4" /> {interview.time}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2 border-blue-100 text-blue-700 hover:bg-blue-50">
                              <Video className="w-4 h-4" /> Join Call
                            </Button>
                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleComplete(interview.candidateName)}>
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Done
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-300">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">No upcoming interviews scheduled.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="animate-in fade-in duration-500">
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500">Your interview history will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Interviews;