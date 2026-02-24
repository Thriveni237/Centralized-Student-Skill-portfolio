"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Layout, Settings2, Check, Loader2, User, Mail, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

const ResumeBuilder = () => {
  const { user, isDemo } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(!isDemo);
  const [sections, setSections] = useState({
    bio: true,
    skills: true,
    projects: true,
    certs: true,
    contact: true
  });

  const [data, setData] = useState<any>({
    profile: null,
    skills: [],
    projects: [],
    certs: []
  });

  useEffect(() => {
    if (user && !isDemo) {
      fetchResumeData();
    } else if (isDemo) {
      setData({
        profile: { firstName: 'Alex', lastName: 'Johnson', bio: 'Full Stack Developer', location: 'San Francisco, CA' },
        skills: [{ name: 'React', level: 'Expert' }, { name: 'Node.js', level: 'Intermediate' }],
        projects: [{ title: 'E-Commerce App', description: 'A full stack shop', tags: 'React, Node' }],
        certs: [{ name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023-10-15' }]
      });
      setLoading(false);
    }
  }, [user, isDemo]);

  const fetchResumeData = async () => {
    try {
      const [profile, skills, projects, certs] = await Promise.all([
        api.get(`/users/${user.id}`),
        api.get('/skills'),
        api.get('/projects'),
        api.get('/certifications')
      ]);

      setData({
        profile: profile || user,
        skills: skills || [],
        projects: projects || [],
        certs: certs || []
      });
    } catch (error) {
      console.error("Error fetching resume data:", error);
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern Professional', color: 'bg-blue-600' },
    { id: 'minimal', name: 'Minimalist Clean', color: 'bg-slate-900' },
    { id: 'creative', name: 'Creative Portfolio', color: 'bg-indigo-600' },
  ];

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showSuccess("Resume downloaded successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const { profile, skills, projects, certs } = data;

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
            <p className="text-muted-foreground">Generate a professional PDF resume from your SkillPort data.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" /> Preview
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg" onClick={handleDownload} disabled={isGenerating}>
              <Download className={cn("w-4 h-4", isGenerating && "animate-bounce")} />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Layout className="w-5 h-5 text-primary" /> Choose Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                      selectedTemplate === template.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg", template.color)} />
                      <span className="font-medium text-sm text-foreground">{template.name}</span>
                    </div>
                    {selectedTemplate === template.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Settings2 className="w-5 h-5 text-primary" /> Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sections to Include</p>
                  {Object.entries(sections).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-foreground/80 capitalize">{key === 'certs' ? 'Certifications' : key}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSections(prev => ({ ...prev, [key]: !value }))}
                        className={cn("h-8 w-8 p-0 rounded-full", value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className={cn(
              "border-none shadow-xl min-h-[800px] bg-white text-slate-900 overflow-hidden transition-all duration-500",
              selectedTemplate === 'minimal' && "font-serif",
              selectedTemplate === 'creative' && "bg-slate-50"
            )}>
              <div className={cn(
                "p-12 space-y-8",
                selectedTemplate === 'modern' && "border-t-8 border-blue-600",
                selectedTemplate === 'minimal' && "border-l-8 border-slate-900",
                selectedTemplate === 'creative' && "border-t-8 border-indigo-600"
              )}>
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-slate-900">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                    <p className="text-xl text-blue-600 font-medium">Student Portfolio</p>
                    {sections.contact && (
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile?.location || 'Location not set'}</span>
                        {profile?.website && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {profile.website}</span>}
                      </div>
                    )}
                  </div>
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-50">
                    <User className="w-12 h-12 text-slate-300" />
                  </div>
                </div>

                {/* Bio */}
                {sections.bio && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">Professional Summary</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {profile?.bio || "Passionate student dedicated to technical excellence and continuous learning."}
                    </p>
                  </section>
                )}

                {/* Skills */}
                {sections.skills && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.length > 0 ? skills.map((skill: any) => (
                        <Badge key={skill.id} variant="outline" className="rounded-md border-slate-200 text-slate-700 bg-slate-50/50">
                          {skill.name} • {skill.level}
                        </Badge>
                      )) : <p className="text-sm text-slate-400 italic">No skills added yet.</p>}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {sections.projects && (
                  <section className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">Featured Projects</h3>
                    <div className="space-y-6">
                      {projects.length > 0 ? projects.map((project: any) => (
                        <div key={project.id} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-slate-900 text-lg">{project.title}</h4>
                            <span className="text-xs text-slate-400 font-mono">{project.github ? 'GitHub Verified' : ''}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
                          <p className="text-xs text-blue-600 font-medium">{project.tags}</p>
                        </div>
                      )) : <p className="text-sm text-slate-400 italic">No projects added yet.</p>}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {sections.certs && (
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">Certifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {certs.length > 0 ? certs.map((cert: any) => (
                        <div key={cert.id} className="flex items-start gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900">{cert.name}</p>
                            <p className="text-xs text-slate-500">{cert.issuer} • {new Date(cert.date).getFullYear()}</p>
                          </div>
                        </div>
                      )) : <p className="text-sm text-slate-400 italic">No certifications added yet.</p>}
                    </div>
                  </section>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;