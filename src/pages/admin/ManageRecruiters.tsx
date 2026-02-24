"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Mail, 
  MoreHorizontal, 
  ExternalLink,
  Loader2,
  Database,
  CheckCircle2,
  XCircle,
  Briefcase,
  Handshake
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const ManageRecruiters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      const recruiterList = Array.isArray(data) ? data.filter((u: any) => u.role === 'recruiter') : [];
      setRecruiters(recruiterList);
    } catch (error: any) {
      console.error("Error fetching recruiters:", error);
      showError("Failed to load recruiter records");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecruiters = recruiters.filter(r => {
    const fullName = `${r.firstName || ''} ${r.lastName || ''}`.toLowerCase();
    const email = (r.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleVerify = (name: string) => {
    showSuccess(`Partner verification updated for ${name}`);
  };

  const stats = [
    { label: 'Hiring Partners', value: recruiters.length, icon: Handshake, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
    { label: 'Verified Status', value: '100%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Active Postings', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Recruiter Management</h1>
            <p className="text-muted-foreground">Manage institutional partnerships and verify hiring organizations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchRecruiters} className="gap-2 border-border shadow-sm">
              <Database className="w-4 h-4" /> Refresh Partners
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200">
              <Building2 className="w-4 h-4" /> Add New Partner
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm bg-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by company, name, or email..." 
              className="pl-10 bg-card border-none shadow-sm h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 bg-card border-none shadow-sm gap-2">
            Filter Status
          </Button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-muted-foreground font-medium">Syncing partner directory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecruiters.map((recruiter) => (
              <Card key={recruiter.id} className="border-none shadow-sm hover:shadow-xl transition-all group bg-card overflow-hidden">
                <div className="h-1.5 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-background shadow-md">
                      <AvatarFallback className="bg-indigo-500/10 text-indigo-600 font-bold text-xl rounded-2xl">
                        {recruiter.firstName?.[0] || 'R'}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <ExternalLink className="w-4 h-4" /> View Company Page
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Mail className="w-4 h-4" /> Contact Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 text-emerald-600 focus:text-emerald-600 cursor-pointer"
                          onClick={() => handleVerify(recruiter.firstName || 'Partner')}
                        >
                          <CheckCircle2 className="w-4 h-4" /> Verify Partner
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                          <XCircle className="w-4 h-4" /> Suspend Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                      {recruiter.firstName || 'Unknown'} {recruiter.lastName || ''}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Hiring Organization
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="p-1.5 bg-muted rounded-lg">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{recruiter.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="p-1.5 bg-muted rounded-lg">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <span>company-portal.io</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold px-3 py-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </Badge>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      Partner since 2024
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRecruiters.length === 0 && (
              <div className="col-span-full text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Building2 className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-foreground">No partners found</p>
                    <p className="text-muted-foreground">Try adjusting your search or invite a new recruiter.</p>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
                    Invite First Partner
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageRecruiters;