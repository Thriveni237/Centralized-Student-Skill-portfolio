"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MoreVertical, 
  Users, 
  Eye, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const RecruiterJobs = () => {
  const { user, isDemo } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: '',
    tags: '',
    company: 'TechFlow Solutions'
  });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const data = await api.get(isDemo ? '/jobs' : `/jobs/recruiter/${user.id}`);
      setJobs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      if (!isDemo) showError(error.message);
      // Fallback for demo if API fails
      if (isDemo) {
        setJobs([
          { id: '1', title: 'Senior Frontend Engineer', company: 'TechFlow Solutions', location: 'Remote', type: 'Full-time', salary: '$140k - $180k', tags: 'React, TypeScript, Next.js', createdAt: new Date().toISOString(), applicants: 12, views: 450 },
          { id: '2', title: 'Product Design Intern', company: 'TechFlow Solutions', location: 'San Francisco, CA', type: 'Internship', salary: '$35/hr', tags: 'Figma, UI/UX, Research', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), applicants: 45, views: 1200 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    
    const jobData = {
      ...formData,
      recruiterId: user.id
    };

    try {
      if (isDemo) {
        setJobs([{ ...jobData, id: Math.random().toString(), createdAt: new Date().toISOString(), applicants: 0, views: 0 }, ...jobs]);
        showSuccess("Job posted (Demo Mode)");
      } else {
        const newJob = await api.post('/jobs', jobData);
        setJobs([{ ...newJob, applicants: 0, views: 0 }, ...jobs]);
        showSuccess("Job posted successfully!");
      }
      setIsAdding(false);
      setFormData({ title: '', description: '', location: '', type: 'Full-time', salary: '', tags: '', company: 'TechFlow Solutions' });
    } catch (error: any) {
      showError(error.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    
    try {
      if (!isDemo) await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
      showSuccess("Job posting removed");
    } catch (error: any) {
      showError(error.message);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, jobs]);

  const stats = [
    { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Applicants', value: jobs.reduce((acc, j) => acc + (j.applicants || 0), 0), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Profile Views', value: jobs.reduce((acc, j) => acc + (j.views || 0), 0), icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Conversion Rate', value: '4.2%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Job Management</h1>
            <p className="text-slate-500">Create, track, and manage your open opportunities.</p>
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            className={cn(
              "shadow-lg transition-all",
              isAdding ? "bg-slate-200 text-slate-900 hover:bg-slate-300" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            )}
          >
            {isAdding ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Post New Job</>}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isAdding && (
          <Card className="border-none shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
            <div className="h-1.5 bg-blue-600" />
            <CardHeader>
              <CardTitle>Create Job Posting</CardTitle>
              <CardDescription>Fill in the details to attract the best student talent.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input 
                      id="title" 
                      required 
                      placeholder="e.g. Software Engineer Intern"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Employment Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input 
                        id="location" 
                        className="pl-10"
                        placeholder="e.g. Remote, NY"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input 
                        id="salary" 
                        className="pl-10"
                        placeholder="e.g. $80k - $100k"
                        value={formData.salary}
                        onChange={e => setFormData({...formData, salary: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Skills (comma separated)</Label>
                    <Input 
                      id="tags" 
                      placeholder="React, Node, SQL"
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea 
                    id="description" 
                    rows={5}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-100" disabled={posting}>
                  {posting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  Publish Job Posting
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search your job postings..." 
              className="pl-10 bg-white border-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="bg-white border-none shadow-sm gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <Card key={job.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-2 bg-blue-600" />
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-medium">
                              Active
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-500" /> {job.type}</span>
                            <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> {job.salary || 'Competitive'}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {job.tags?.split(',').map((tag: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-slate-400 border-slate-200">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 lg:border-l lg:pl-8">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">{job.applicants || 0}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Applicants</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">{job.views || 0}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Views</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link to={`/dashboard/recruiter/jobs/${job.id}/applicants`}>
                              <Button variant="outline" size="sm" className="gap-2 border-blue-100 text-blue-700 hover:bg-blue-50">
                                <Users className="w-4 h-4" /> Applicants
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="gap-2">
                                  <Edit2 className="w-4 h-4" /> Edit Posting
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Eye className="w-4 h-4" /> View Public Page
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDelete(job.id)}>
                                  <Trash2 className="w-4 h-4" /> Delete Posting
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No job postings found</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                  You haven't posted any opportunities yet. Start by creating your first job listing.
                </p>
                <Button 
                  variant="link" 
                  className="mt-4 text-blue-600 font-bold"
                  onClick={() => setIsAdding(true)}
                >
                  Post your first job
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterJobs;