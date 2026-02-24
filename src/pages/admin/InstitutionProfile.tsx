"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, MapPin, Globe, Mail, Phone, Camera, Plus, Trash2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const InstitutionProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    website: '',
    email: '',
    phone: '',
    description: '',
    departments: [] as string[]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccess("Institution profile updated!");
    }, 1000);
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Institution Profile</h1>
          <p className="text-muted-foreground">Manage your college's public information and departments.</p>
        </div>

        <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Institution Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter institution name"
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="address" 
                      className="pl-10"
                      placeholder="Enter physical address"
                      value={profile.address}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-foreground">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="website" 
                        className="pl-10"
                        placeholder="https://example.edu"
                        value={profile.website}
                        onChange={e => setProfile({...profile, website: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        className="pl-10"
                        placeholder="admin@example.edu"
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">About the Institution</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    placeholder="Describe your institution..."
                    value={profile.description}
                    onChange={e => setProfile({...profile, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.departments.map(dept => (
                    <div key={dept} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {dept}
                      <button 
                        type="button" 
                        onClick={() => removeDepartment(dept)}
                        className="hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-dashed"
                    onClick={addDepartment}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Department
                  </Button>
                </div>
                {profile.departments.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No departments added yet.</p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Institution Logo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
                    <Building2 className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Upload your college logo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Institution Stats</h3>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Total Students</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Active Recruiters</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Placement Rate</span>
                    <span className="font-bold text-emerald-300">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default InstitutionProfile;