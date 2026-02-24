"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, Shield, User, Globe, Moon, Sun, Loader2, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { user, isDemo, login, signOut } = useAuth();
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    language: user?.language || 'English (US)',
    darkMode: theme === 'dark',
    notifMessages: user?.notifMessages ?? true,
    notifApplications: user?.notifApplications ?? true,
    notifMarketing: user?.notifMarketing ?? false,
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        language: user.language || 'English (US)',
        darkMode: theme === 'dark',
        notifMessages: user.notifMessages ?? true,
        notifApplications: user.notifApplications ?? true,
        notifMarketing: user.notifMarketing ?? false,
      }));
    }
  }, [user, theme]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'security' && formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        showError("Passwords do not match");
        return;
      }
    }

    if (isDemo) {
      showSuccess("Settings updated (Demo Mode)");
      return;
    }

    setIsLoading(true);
    try {
      const updatePayload: any = { ...formData };
      if (formData.newPassword) {
        updatePayload.password = formData.newPassword;
      }
      
      const updatedUser = await api.put(`/users/${user.id}`, updatePayload);
      login(updatedUser);
      showSuccess("Settings updated successfully!");
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (error: any) {
      showError(error.message || "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure? This action cannot be undone.")) return;
    
    if (isDemo) {
      showSuccess("Account deleted (Demo Mode)");
      signOut();
      navigate('/');
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);
      showSuccess("Your account has been deleted.");
      signOut();
      navigate('/');
    } catch (error: any) {
      showError(error.message || "Failed to delete account");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and security settings.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-1">
            {[
              { id: 'general', label: 'General', icon: User },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Shield },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSave}>
              {activeTab === 'general' && (
                <Card className="border-none shadow-sm animate-in fade-in duration-300 dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle>General Preferences</CardTitle>
                    <CardDescription>Update your basic account information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName} 
                          onChange={e => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName} 
                          onChange={e => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Input 
                        id="language" 
                        value={formData.language} 
                        onChange={e => setFormData({...formData, language: e.target.value})}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Appearance</h4>
                      <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border shadow-sm dark:border-slate-700">
                            {formData.darkMode ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Dark Mode</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes.</p>
                          </div>
                        </div>
                        <Switch 
                          checked={formData.darkMode} 
                          onCheckedChange={checked => {
                            setFormData({...formData, darkMode: checked});
                            setTheme(checked ? 'dark' : 'light');
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="border-none shadow-sm animate-in fade-in duration-300 dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Update your password and secure your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={formData.newPassword}
                        onChange={e => setFormData({...formData, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="border-none shadow-sm animate-in fade-in duration-300 dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Choose what updates you want to receive.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { id: 'notifMessages', label: 'New Messages', desc: 'Get notified when someone sends you a message.' },
                        { id: 'notifApplications', label: 'Application Updates', desc: 'Receive alerts about your job applications.' },
                        { id: 'notifMarketing', label: 'Marketing', desc: 'Stay updated with our latest features and news.' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                          </div>
                          <Switch 
                            checked={(formData as any)[item.id]} 
                            onCheckedChange={checked => setFormData({...formData, [item.id]: checked})}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'privacy' && (
                <Card className="border-none shadow-sm animate-in fade-in duration-300 dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your profile visibility and data.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Public Profile</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Allow recruiters to find your profile in search.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Email</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Display your email address on your public portfolio.</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end pt-6">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>

            {activeTab === 'general' && (
              <Card className="border-none shadow-sm border-red-100 bg-red-50/30 mt-6 dark:bg-red-900/10 dark:border-red-900/20">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" /> Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Delete Account</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Permanently remove your account and all data.</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;