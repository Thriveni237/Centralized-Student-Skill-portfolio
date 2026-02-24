"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Camera, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Briefcase,
  Heart
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState({
    name: 'TechFlow Solutions',
    website: 'techflow.io',
    location: 'San Francisco, CA',
    size: '50-200 employees',
    industry: 'Software Development',
    description: 'TechFlow is a leading provider of cloud-native solutions, helping businesses scale their infrastructure with cutting-edge technology. We focus on developer experience and high-performance systems.',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    perks: ['Remote Friendly', 'Health Insurance', 'Flexible Hours', 'Learning Budget']
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      showSuccess("Company profile updated successfully!");
    }, 800);
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? "Edit Company Profile" : "Company Presence"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your company details and culture." : "This is how your company appears to students."}
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
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Core Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name</Label>
                      <Input 
                        id="name" 
                        value={company.name}
                        onChange={e => setCompany({...company, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry" 
                        value={company.industry}
                        onChange={e => setCompany({...company, industry: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input 
                        id="website" 
                        value={company.website}
                        onChange={e => setCompany({...company, website: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Headquarters</Label>
                      <Input 
                        id="location" 
                        value={company.location}
                        onChange={e => setCompany({...company, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">About the Company</Label>
                    <Textarea 
                      id="description" 
                      rows={5}
                      value={company.description}
                      onChange={e => setCompany({...company, description: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Culture & Perks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {company.perks.map(perk => (
                      <Badge key={perk} variant="secondary" className="gap-2 px-3 py-1.5 bg-primary/10 text-primary border-none">
                        {perk}
                        <button type="button" onClick={() => setCompany({...company, perks: company.perks.filter(p => p !== perk)})} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full border-dashed h-8">
                      <Plus className="w-3 h-3 mr-1" /> Add Perk
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Brand Assets</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
                      {company.logo ? (
                        <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    Upload your company logo. Recommended: 400x400px.
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
              <div className="h-32 bg-gradient-to-r from-primary to-indigo-700" />
              <CardContent className="relative pt-0 pb-8 px-8">
                <div className="flex flex-col md:flex-row items-end gap-6 -mt-12">
                  <div className="w-32 h-32 rounded-3xl border-4 border-card bg-card shadow-lg overflow-hidden flex items-center justify-center">
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-foreground">{company.name}</h2>
                      <Badge className="bg-primary/10 text-primary border-none">Verified Partner</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {company.website}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {company.location}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={`https://${company.website}`} target="_blank" rel="noreferrer">
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
                    <Building2 className="w-5 h-5 text-primary" /> About the Company
                  </h3>
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {company.description}
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive" /> Culture & Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {company.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border">
                        <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="font-medium text-foreground/90">{perk}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-secondary text-secondary-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg">Company Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Company Size</p>
                        <p className="font-bold">{company.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Industry</p>
                        <p className="font-bold">{company.industry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-bold text-primary">Hiring Status</h4>
                    <p className="text-sm text-muted-foreground">
                      You currently have 5 active job postings. Students are actively viewing your profile.
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Manage Jobs
                    </Button>
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

export default CompanyProfile;