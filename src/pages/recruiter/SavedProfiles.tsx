"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Trash2, 
  Mail, 
  User, 
  ExternalLink, 
  Search, 
  Filter,
  Bookmark,
  Loader2,
  Code2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const SavedProfiles = () => {
  const { isDemo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedStudents, setSavedStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSavedProfiles();
  }, []);

  const fetchSavedProfiles = async () => {
    setLoading(true);
    try {
      // Get saved IDs from localStorage (simulating a real saved_profiles table)
      const savedIds = JSON.parse(localStorage.getItem('saved_candidate_ids') || '[]');
      
      if (savedIds.length === 0 && !isDemo) {
        setSavedStudents([]);
        setLoading(false);
        return;
      }

      // Fetch all students and filter by saved IDs
      const allStudents = await api.get('/users?role=student');
      const filtered = Array.isArray(allStudents) 
        ? allStudents.filter((s: any) => savedIds.includes(s.id))
        : [];
      
      // If demo and nothing saved, show some mock data
      if (isDemo && filtered.length === 0) {
        setSavedStudents([
          {
            id: 'demo-1',
            firstName: 'Alex',
            lastName: 'Johnson',
            bio: 'Full Stack Developer specializing in React and Spring Boot.',
            location: 'San Francisco, CA',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
            skills: ['React', 'Java', 'Spring Boot']
          },
          {
            id: 'demo-2',
            firstName: 'Sarah',
            lastName: 'Chen',
            bio: 'UI/UX Designer with a passion for accessible web design.',
            location: 'New York, NY',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
            skills: ['Figma', 'UI/UX', 'Tailwind']
          }
        ]);
      } else {
        setSavedStudents(filtered);
      }
    } catch (error: any) {
      showError("Failed to load saved profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string, name: string) => {
    const savedIds = JSON.parse(localStorage.getItem('saved_candidate_ids') || '[]');
    const updatedIds = savedIds.filter((savedId: string) => savedId !== id);
    localStorage.setItem('saved_candidate_ids', JSON.stringify(updatedIds));
    
    setSavedStudents(prev => prev.filter(s => s.id !== id));
    showSuccess(`Removed ${name} from bookmarks`);
  };

  const filteredList = savedStudents.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Talent Bookmarks</h1>
            <p className="text-slate-500">Candidates you've saved for future opportunities.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search bookmarks..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="bg-white border-none shadow-sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredList.map((student) => (
              <Card key={student.id} className="border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xl">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {student.location || 'Remote'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => handleRemove(student.id, student.firstName)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-6 min-h-[40px]">
                    {student.bio || "No bio provided yet. This student is building their professional presence."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(student.skills || ['React', 'TypeScript', 'Node.js']).slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 border-none font-normal">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1 gap-2 border-slate-100 hover:bg-slate-50" asChild>
                      <Link to={`/dashboard/student/profile`}>
                        <User className="w-4 h-4" /> View Profile
                      </Link>
                    </Button>
                    <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
                      <Mail className="w-4 h-4" /> Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Bookmark className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No saved profiles</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Start exploring talent and bookmark candidates you're interested in.
            </p>
            <Link to="/dashboard/recruiter">
              <Button variant="link" className="mt-4 text-blue-600 font-bold">
                Search for talent
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedProfiles;