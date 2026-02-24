"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Linkedin, 
  Globe, 
  MapPin, 
  Edit3, 
  Share2, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Eye,
  FileDown,
  ExternalLink,
  Code2,
  Briefcase,
  User
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { user: authUser, isDemo, login, role: authRole } = useAuth();
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const isOwnProfile = !studentId || studentId === authUser?.id;
  const targetId = studentId || authUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    github: '',
    linkedin: '',
    website: '',
    email: ''
  });

  const [portfolioData, setPortfolioData] = useState({
    skills: [] as any[],
    projects: [] as any[]
  });

  useEffect(() => {
    if (targetId) {
      fetchProfile();
      fetchPortfolioExtras();
    }
  }, [targetId, isDemo]);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      if (isDemo && isOwnProfile) {
        setProfile({
          firstName: authUser?.firstName || 'Alex',
          lastName: authUser?.lastName || 'Johnson',
          bio: 'Passionate software engineering student with a focus on full-stack development.',
          location: 'San Francisco, CA',
          github: 'github.com/alexj',
          linkedin: 'linkedin.com/in/alexj',
          website: 'alexj.dev',
          email: authUser?.email || 'alex@demo.com'
        });
      } else {
        const data = await api.get(`/users/${targetId}`);
        if (data) {
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            bio: data.bio || '',
            location: data.location || '',
            github: data.github || '',
            linkedin: data.linkedin || '',
            website: data.website || '',
            email: data.email || ''
          });
        }
      }
    } catch (error: any) {
      console.error("Failed to load profile data:", error.message);
    } finally {
      setFetching(false);
    }
  };

  const fetchPortfolioExtras = async () => {
    try {
      const [skills, projects] = await Promise.all([
        api.get('/skills'),
        api.get('/projects')
      ]);
      
      setPortfolioData({
        skills: Array.isArray(skills) ? skills : [],
        projects: Array.isArray(projects) ? projects : []
      });
    } catch (e) {
      console.error("Failed to fetch portfolio extras");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      showSuccess("Profile updated (Demo Mode)");
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await api.put(`/users/${authUser.id}`, profile);
      login(updatedUser);
      showSuccess("Profile saved successfully!");
      setIsEditing(false);
    } catch (error: any) {
      showError(error.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.origin + `/dashboard/recruiter/student/${targetId}`;
    navigator.clipboard.writeText(url);
    showSuccess("Profile link copied to clipboard!");
  };

  if (fetching) {
    return (
      <DashboardLayout role={authRole as any}>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}` || 'U';

  if (isPreview || (!isOwnProfile && authRole === 'recruiter')) {
    return (
      <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <ShieldCheck className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="font-bold text-foreground">
                {authRole === 'recruiter' ? 'Student Portfolio' : 'Portfolio Preview'}
              </span>
            </div>
            <Button variant="outline" onClick={() => isPreview ? setIsPreview(false) : navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> {isPreview ? 'Exit Preview' : 'Back to Search'}
            </Button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-20">
          <section className="text-center space-y-8">
            <Avatar className="w-48 h-48 mx-auto border-8 border-card shadow-2xl">
              <AvatarFallback className="text-6xl bg-gradient-to-br from-primary to-indigo-700 text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-4">
              <h2 className="text-6xl font-extrabold tracking-tight text-foreground">
                {profile.firstName} {profile.lastName}
              </h2>
              <div className="flex items-center justify-center gap-6 text-muted-foreground text-lg">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {profile.location || 'Remote'}</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Verified Student</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {profile.github && (
                <Button variant="outline" size="lg" className="rounded-full px-6 hover:bg-foreground hover:text-background transition-all" asChild>
                  <a href={`https://${profile.github}`} target="_blank" rel="noreferrer"><Github className="w-5 h-5 mr-2" /> GitHub</a>
                </Button>
              )}
              {profile.linkedin && (
                <Button variant="outline" size="lg" className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                  <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer"><Linkedin className="w-5 h-5 mr-2" /> LinkedIn</a>
                </Button>
              )}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <section className="space-y-6">
                <h3 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                  <User className="w-8 h-8 text-primary" /> About Me
                </h3>
                <p className="text-2xl text-muted-foreground leading-relaxed font-light">
                  {profile.bio || "I'm a dedicated student building the future of technology."}
                </p>
              </section>

              <section className="space-y-8">
                <h3 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                  <Code2 className="w-8 h-8 text-primary" /> Technical Expertise
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioData.skills.length > 0 ? portfolioData.skills.map((skill, i) => (
                    <div key={i} className="p-6 bg-card rounded-2xl flex items-center justify-between hover:bg-primary/5 transition-colors group border border-border">
                      <span className="text-xl font-bold text-foreground">{skill.name}</span>
                      <Badge className="bg-primary text-primary-foreground border-none px-3 py-1">
                        {skill.level}
                      </Badge>
                    </div>
                  )) : <p className="text-muted-foreground italic">No skills listed yet.</p>}
                </div>
              </section>
            </div>

            <div className="space-y-16">
              <section className="space-y-8">
                <h3 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                  <Briefcase className="w-8 h-8 text-primary" /> Projects
                </h3>
                <div className="space-y-6">
                  {portfolioData.projects.length > 0 ? portfolioData.projects.map((project, i) => (
                    <Card key={i} className="border border-border shadow-lg hover:shadow-xl transition-all group overflow-hidden bg-card">
                      <CardContent className="p-6 space-y-4">
                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{project.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags && typeof project.tags === 'string' ? project.tags.split(',').map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground font-normal">
                              {tag.trim()}
                            </Badge>
                          )) : null}
                        </div>
                      </CardContent>
                    </Card>
                  )) : <p className="text-muted-foreground italic">No projects featured yet.</p>}
                </div>
              </section>

              <Card className="bg-primary text-primary-foreground border-none shadow-2xl rounded-3xl">
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Let's Work Together</h3>
                    <p className="text-primary-foreground/80">I'm currently open to internships and junior developer roles.</p>
                  </div>
                  <Button className="w-full bg-background text-foreground hover:bg-background/90 h-14 text-xl font-bold rounded-2xl" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-6 h-6 mr-3" /> Contact Me
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? "Edit Profile" : "My Professional Profile"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your information below." : "Manage your professional identity and portfolio."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={handleShare} className="gap-2 hidden sm:flex">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/student/resume')} className="gap-2 hidden sm:flex">
                  <FileDown className="w-4 h-4" /> Resume
                </Button>
                <Button variant="secondary" onClick={() => setIsPreview(true)} className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  <Eye className="w-4 h-4" /> Preview Portfolio
                </Button>
                <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profile.firstName} 
                        onChange={e => setProfile({...profile, firstName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profile.lastName} 
                        onChange={e => setProfile({...profile, lastName: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        className="pl-10"
                        placeholder="e.g. New York, NY"
                        value={profile.location} 
                        onChange={e => setProfile({...profile, location: e.target.value})} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Professional Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    rows={6}
                    placeholder="Tell us about your background..."
                    value={profile.bio} 
                    onChange={e => setProfile({...profile, bio: e.target.value})} 
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label>
                    <Input 
                      placeholder="github.com/username"
                      value={profile.github} 
                      onChange={e => setProfile({...profile, github: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</Label>
                    <Input 
                      placeholder="linkedin.com/in/username"
                      value={profile.linkedin} 
                      onChange={e => setProfile({...profile, linkedin: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="w-4 h-4" /> Website</Label>
                    <Input 
                      placeholder="yourwebsite.com"
                      value={profile.website} 
                      onChange={e => setProfile({...profile, website: e.target.value})} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="md:col-span-2 space-y-8">
              <Card className="border-none shadow-sm overflow-hidden bg-card">
                <div className="h-40 bg-gradient-to-r from-primary via-primary/80 to-indigo-600" />
                <CardContent className="relative pt-0 pb-8 px-8">
                  <div className="flex flex-col md:flex-row items-end gap-6 -mt-16">
                    <Avatar className="w-32 h-32 border-4 border-card shadow-xl">
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold text-foreground">
                          {profile.firstName} {profile.lastName}
                        </h2>
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location || 'Location not set'}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {profile.bio || "No bio added yet. Click 'Edit Profile' to tell recruiters about yourself."}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.github && (
                    <a href={`https://${profile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                      <Github className="w-5 h-5 text-foreground" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">GitHub</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group">
                      <Linkedin className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary group-hover:text-primary/80">LinkedIn</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-primary/60" />
                    </a>
                  )}
                  {profile.website && (
                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors group">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-500/80">Portfolio</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-indigo-500/60" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;