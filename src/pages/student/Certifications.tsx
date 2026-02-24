"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  Award, 
  Calendar, 
  ExternalLink, 
  Loader2, 
  ShieldCheck, 
  Building2,
  X,
  CheckCircle2
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

const Certifications = () => {
  const { user, isDemo } = useAuth();
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(!isDemo);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    link: ''
  });

  useEffect(() => {
    if (user && !isDemo) fetchCerts();
    else if (isDemo) {
      setCerts([
        {
          id: '1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023-10-15',
          link: 'aws.amazon.com/verify'
        },
        {
          id: '2',
          name: 'Meta Front-End Developer Professional Certificate',
          issuer: 'Coursera / Meta',
          date: '2023-05-20',
          link: 'coursera.org/verify'
        }
      ]);
      setLoading(false);
    }
  }, [user, isDemo]);

  const fetchCerts = async () => {
    try {
      const data = await api.get('/certifications');
      setCerts(data || []);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      setCerts([{ ...formData, id: Math.random().toString() }, ...certs]);
      setIsAdding(false);
      setFormData({ name: '', issuer: '', date: '', link: '' });
      showSuccess("Certification added (Demo)");
      return;
    }

    try {
      const data = await api.post('/certifications', formData);
      setCerts([data, ...certs]);
      setFormData({ name: '', issuer: '', date: '', link: '' });
      setIsAdding(false);
      showSuccess("Certification verified and added!");
    } catch (error: any) {
      showError(error.message);
    }
  };

  const removeCert = async (id: string) => {
    if (isDemo) {
      setCerts(certs.filter(c => c.id !== id));
      return;
    }
    try {
      await api.delete(`/certifications/${id}`);
      setCerts(certs.filter(c => c.id !== id));
      showSuccess("Certification removed");
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
            <p className="text-muted-foreground">Official credentials that validate your professional expertise.</p>
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            className={cn(
              "transition-all shadow-lg",
              isAdding ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            {isAdding ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add Certification</>}
          </Button>
        </div>

        {isAdding && (
          <Card className="border-none shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Credential Details</CardTitle>
              <CardDescription>Enter the details of your earned certification.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCert} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Certification Name</Label>
                    <Input 
                      required 
                      placeholder="e.g. Google Data Analytics"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Issuing Organization</Label>
                    <Input 
                      required 
                      placeholder="e.g. Google, Microsoft, AWS"
                      value={formData.issuer}
                      onChange={e => setFormData({...formData, issuer: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Issue Date</Label>
                    <Input 
                      type="date" 
                      required 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Credential URL (Verification Link)</Label>
                    <Input 
                      type="url" 
                      placeholder="https://verify.com/id"
                      value={formData.link}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg shadow-lg">
                  Verify & Save Certification
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {certs.length > 0 ? certs.map((cert) => (
              <Card key={cert.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-card">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="w-2 bg-emerald-500" />
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                          <Award className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground">{cert.name}</h3>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                              <Building2 className="w-4 h-4" /> {cert.issuer}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" /> Issued {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {cert.link && (
                          <Button variant="outline" className="gap-2 border-border hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-all" asChild>
                            <a href={`https://${cert.link}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" /> View Certificate
                            </a>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => removeCert(cert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No certifications yet</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  Add your professional certifications to build trust with recruiters.
                </p>
                <Button 
                  variant="link" 
                  className="mt-4 text-emerald-600 font-bold"
                  onClick={() => setIsAdding(true)}
                >
                  Add your first certification
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Certifications;