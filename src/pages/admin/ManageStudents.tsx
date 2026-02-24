"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  MoreVertical, 
  UserX, 
  Mail,
  Download,
  Loader2,
  Database,
  Users,
  UserCheck,
  UserPlus,
  Filter
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

const ManageStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      // Ensure data is an array before filtering
      const studentList = Array.isArray(data) ? data.filter((u: any) => u.role === 'student') : [];
      setStudents(studentList);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      showError("Failed to load student records");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const email = (s.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleStatusToggle = (name: string) => {
    showSuccess(`Updated status for ${name}`);
  };

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Active Now', value: students.length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'New This Month', value: 0, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Student Management</h1>
            <p className="text-muted-foreground">Oversee student accounts, monitor activity, and manage permissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchStudents} className="gap-2 border-border shadow-sm">
              <Database className="w-4 h-4" /> Sync Data
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20">
              <Download className="w-4 h-4" /> Export CSV
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

        {/* Main Content Card */}
        <Card className="border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">Student Directory</CardTitle>
                <CardDescription>A complete list of all students registered in the system.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    className="pl-10 bg-background border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="border-border">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading student records...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                      <TableHead className="w-[300px] text-foreground font-bold py-4">Student</TableHead>
                      <TableHead className="text-foreground font-bold">Email Address</TableHead>
                      <TableHead className="text-foreground font-bold">Status</TableHead>
                      <TableHead className="text-foreground font-bold">Joined Date</TableHead>
                      <TableHead className="text-right text-foreground font-bold pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="border-border hover:bg-muted/20 transition-colors group">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {student.firstName?.[0] || ''}{student.lastName?.[0] || ''}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {student.firstName || 'Unknown'} {student.lastName || ''}
                              </span>
                              <span className="text-xs text-muted-foreground">ID: {String(student.id).slice(0, 8)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">
                          {student.email || 'No email'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold px-3">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          Oct 24, 2024
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Users className="w-4 h-4" /> View Portfolio
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Mail className="w-4 h-4" /> Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => handleStatusToggle(student.firstName || 'Student')}
                              >
                                <UserX className="w-4 h-4" /> Deactivate Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="p-4 bg-muted rounded-full">
                              <Users className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-bold text-foreground">No students found</p>
                              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                            </div>
                          </div>
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

export default ManageStudents;