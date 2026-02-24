"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { showSuccess } from '@/utils/toast';

const ManageRecruiters = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const recruiters = [
    { id: '1', name: 'TechFlow Solutions', contact: 'Sarah Miller', email: 'sarah@techflow.io', status: 'Verified', jobs: 5 },
    { id: '2', name: 'CloudScale AI', contact: 'David Chen', email: 'd.chen@cloudscale.ai', status: 'Pending', jobs: 2 },
    { id: '3', name: 'Creative Pulse', contact: 'Emma Wilson', email: 'emma@creativepulse.com', status: 'Verified', jobs: 8 },
    { id: '4', name: 'DataDynamics', contact: 'Robert Fox', email: 'robert@datadynamics.com', status: 'Suspended', jobs: 0 },
  ];

  const filteredRecruiters = recruiters.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = (name: string) => {
    showSuccess(`Verified ${name} as a trusted partner`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Recruiters</h1>
            <p className="text-muted-foreground">Verify and monitor hiring partners on the platform.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Invite Partner</Button>
        </div>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-0">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search companies or contacts..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground">Company</TableHead>
                    <TableHead className="text-foreground">Primary Contact</TableHead>
                    <TableHead className="text-foreground">Active Jobs</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecruiters.map((recruiter) => (
                    <TableRow key={recruiter.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{recruiter.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{recruiter.contact}</span>
                          <span className="text-xs text-muted-foreground">{recruiter.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {recruiter.jobs} Jobs
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            recruiter.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 
                            recruiter.status === 'Suspended' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                          }
                        >
                          {recruiter.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <ExternalLink className="w-4 h-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => handleVerify(recruiter.name)}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verify Partner
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <XCircle className="w-4 h-4" /> Suspend Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageRecruiters;