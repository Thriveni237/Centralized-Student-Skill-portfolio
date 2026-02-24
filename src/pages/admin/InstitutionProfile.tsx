"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Camera, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X,
  ExternalLink,
  Users,
  GraduationCap
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';

const InstitutionProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Global Institute of Technology',
    address: '123 University Ave, Tech City, TC 54321',
    website: 'www.git-edu.org',
    email: 'admin@git-edu.org',
    phone: '+1 (555) 012-3456',
    description: 'A premier institution dedicated to fostering innovation and excellence in engineering and technology. Our campus provides state-of-the-art facilities for students to grow and succeed in the modern workforce.',
    departments: ['Computer Science', 'Electrical Engineering', 'Data Science', 'Mechanical Engineering']
  });

  // Load saved profile on mount
  useEffect(() => {
    const saved = localStorage.getItem('institution_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('institution_profile', JSON.stringify(profile));
      setIsLoading(false);
      setIsEditing(false);
      showSuccess("Institution profile updated successfully!");
    }, 800);
  };

  const removeDepartment = (deptToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== deptToRemove)
    }));
  };

  const addDepartment = () => {
    const dept = prompt("Enter department name:");
    if (dept && !profile.departments.includes(dept)) {
      setProfile(prev => ({
        ...prev,
        departments: [...prev.departments, dept]
      }));
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {isEditing ? "Edit Institution Profile" : "Institution Presence"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your college's public information." : "This is how your institution appears to recruiters and students."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2">
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Core Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Address</Label>
                    <Input 
                      id="address" 
                      value={profile.address}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input 
                        id="website" 
                        value={profile.website}
                        onChange={e => setProfile({...profile, website: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Admin Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">About the Institution</Label>
                    <Textarea 
                      id="description" 
                      rows={5}
                      value={profile.description}
                      onChange={e => setProfile({...profile, description: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Departments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.departments.map(dept => (
                      <Badge key={dept} variant="secondary" className="gap-2 px-3 py-1.5 bg-primary/10 text-primary border-none">
                        {dept}
                        <button type="button" onClick={() => removeDepartment(dept)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="rounded-full border-dashed h-8" onClick={addDepartment}>
                      <Plus className="w-3 h-3 mr-1" /> Add Department
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Institution Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
                      <Building2 className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    Upload your college logo. Recommended: 400x400px.
                  </p>
                </CardContent>
              </Card>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Card */}
            <Card className="border-none shadow-xl overflow-hidden bg-card">
              <div className="h-40 bg-gradient-to-r from-indigo-600 via-primary to-blue-600" />
              <CardContent className="relative pt-0 pb-8 px-8">
                <div className="flex flex-col md:flex-row items-end gap-6 -mt-16">
                  <div className="w-32 h-32 rounded-3xl border-4 border-card bg-card shadow-lg overflow-hidden flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-primary" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-foreground">{profile.name}</h2>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Verified Institution</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {profile.website}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.address}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer">
                      Visit Website <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" /> About the Institution
                  </h3>
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {profile.description}
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" /> Academic Departments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.departments.map((dept, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border">
                        <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground/90">{dept}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-secondary text-secondary-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin Email</p>
                        <p className="font-bold">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <Phone className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</p>
                        <p className="font-bold">{profile.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-bold text-primary flex items-center gap-2">
                      <Users className="w-4 h-4" /> Platform Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Students</span>
                        <span className="font-bold">1,240</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Recruiters</span>
                        <span className="font-bold">45</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstitutionProfile;