"use client";

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Landing = () => {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session && role) {
      navigate(`/dashboard/${role}`);
    }
  }, [session, role, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">SkillPort</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Trusted by 50+ Universities
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                Bridge the gap between <span className="text-primary">Skills</span> and <span className="text-primary">Careers</span>.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
                The ultimate portfolio management system for students to showcase their expertise and for recruiters to find top-tier talent.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg">
                    Create Your Portfolio <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 bg-card rounded-2xl shadow-2xl border p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                  alt="Dashboard Preview" 
                  className="rounded-xl opacity-90 dark:opacity-80"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full -z-0 blur-3xl opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/30 rounded-full -z-0 blur-3xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tailored for Every User</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Choose your path and start leveraging the power of SkillPort today.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="text-primary w-6 h-6" />
                </div>
                <CardTitle>For Students</CardTitle>
                <CardDescription>Build a professional presence that stands out.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {['Showcase skills & projects', 'Manage certifications', 'Generate shareable portfolio', 'Track career progress'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-primary w-4 h-4" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="text-primary w-6 h-6" />
                </div>
                <CardTitle>For Recruiters</CardTitle>
                <CardDescription>Find the perfect match for your team.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {['Advanced skill filtering', 'Verified student profiles', 'Direct contact options', 'Save favorite candidates'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-primary w-4 h-4" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="text-primary w-6 h-6" />
                </div>
                <CardTitle>For Admins</CardTitle>
                <CardDescription>Manage and monitor your institution.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {['Student performance stats', 'User management', 'System-wide analytics', 'Data export tools'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-primary w-4 h-4" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 SkillPort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;