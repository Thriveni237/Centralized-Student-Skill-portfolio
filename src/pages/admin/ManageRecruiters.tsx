"use client";

import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Loader2,
  Database
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';

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
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecruiters = recruiters.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchRecruiters} className="gap-2">
              <Database className="w-4 h-4" /> Refresh Data
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Invite Partner</Button>
          </div>
        </div>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-0">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search recruiters..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-foreground">Recruiter Name</TableHead>
                      <TableHead className="text-foreground">Email</TableHead>
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
                            <span className="font-medium text-foreground">{recruiter.firstName} {recruiter.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{recruiter.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none">
                            Verified
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
                                onClick={() => handleVerify(recruiter.firstName)}
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
                    {filteredRecruiters.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No recruiters found in the database.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageRecruiters;