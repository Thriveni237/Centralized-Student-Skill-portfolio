"use client";

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, MapPin, Bookmark, BookmarkCheck, Loader2, Mail, User } from 'lucide-react';
import { api } from '@/lib/api';
import { showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const mockStudents = [
    {
      id: 'demo-1',
      firstName: 'Alex',
      lastName: 'Johnson',
      bio: 'Full Stack Developer specializing in React and Spring Boot.',
      location: 'San Francisco, CA',
      email: 'alex@demo.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: 'demo-2',
      firstName: 'Sarah',
      lastName: 'Chen',
      bio: 'UI/UX Designer with a passion for accessible web design.',
      location: 'New York, NY',
      email: 'sarah@demo.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    }
  ];

  useEffect(() => {
    // Load saved IDs from localStorage on mount
    const stored = JSON.parse(localStorage.getItem('saved_candidate_ids') || '[]');
    setSavedIds(stored);

    if (isDemo) {
      setStudents(mockStudents);
      setLoading(false);
    } else {
      fetchStudents();
    }
  }, [isDemo]);

  const fetchStudents = async () => {
    try {
      const data = await api.get('/users?role=student');
      setStudents(data || []);
    } catch (error: any) {
      showError(error.message);
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.bio && student.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, students]);

  const toggleSave = (id: string, name: string) => {
    const isSaved = savedIds.includes(id);
    let newSavedIds: string[];
    
    if (isSaved) {
      newSavedIds = savedIds.filter(i => i !== id);
      showSuccess(`Removed ${name} from bookmarks`);
    } else {
      newSavedIds = [...savedIds, id];
      showSuccess(`Saved ${name} to bookmarks`);
    }
    
    setSavedIds(newSavedIds);
    localStorage.setItem('saved_candidate_ids', JSON.stringify(newSavedIds));
  };

  const handleContact = (email: string) => {
    window.location.href = `mailto:${email}?subject=Opportunity from SkillPort`;
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Talent Search</h1>
            <p className="text-muted-foreground">
              {isDemo ? "Viewing demo candidates (Demo Mode)" : "Find real candidates registered on the platform."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or bio..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <Card key={student.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <Avatar className="w-16 h-16 border group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {student.firstName} {student.lastName}
                            </h3>
                            <p className="text-primary font-medium text-sm">Student</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleSave(student.id, student.firstName)}
                              className={savedIds.includes(student.id) ? "text-primary" : "text-muted-foreground"}
                            >
                              {savedIds.includes(student.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                            </Button>
                            <Link to={`/dashboard/recruiter/student/${student.id}`}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <User className="w-4 h-4" /> View Profile
                              </Button>
                            </Link>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => handleContact(student.email)}
                            >
                              <Mail className="w-4 h-4 mr-2" /> Contact
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {student.location || 'Remote'}</span>
                          <p className="text-foreground/80 line-clamp-1">{student.bio || 'No bio provided yet.'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <p className="text-muted-foreground">No candidates found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;