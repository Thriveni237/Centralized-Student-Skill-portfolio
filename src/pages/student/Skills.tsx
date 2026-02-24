"use client";

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Code2, 
  Loader2, 
  Zap, 
  BookOpen, 
  BarChart3, 
  Layers,
  Star,
  Clock
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Skill {
  id: string;
  name: string;
  level: string;
  category: string;
  yearsOfExperience?: number;
  isLearningPath: boolean;
}

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "Design",
  "DevOps",
  "Data Science",
  "Tools",
  "Soft Skills"
];

const Skills = () => {
  const { user, isDemo } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(!isDemo);
  const [adding, setAdding] = useState(false);
  
  // Form State
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState('Intermediate');
  const [newCategory, setNewCategory] = useState('Frontend');
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    if (user && !isDemo) fetchSkills();
    else if (isDemo) {
      setSkills([
        { id: '1', name: 'React', level: 'Expert', category: 'Frontend', isLearningPath: false, yearsOfExperience: 3 },
        { id: '2', name: 'TypeScript', level: 'Advanced', category: 'Frontend', isLearningPath: false, yearsOfExperience: 2 },
        { id: '3', name: 'Node.js', level: 'Intermediate', category: 'Backend', isLearningPath: false, yearsOfExperience: 1 },
        { id: '4', name: 'Docker', level: 'Beginner', category: 'DevOps', isLearningPath: true, yearsOfExperience: 0 },
      ]);
      setLoading(false);
    }
  }, [user, isDemo]);

  const fetchSkills = async () => {
    try {
      const data = await api.get('/skills');
      setSkills(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill) return;
    
    const skillData = { 
      name: newSkill, 
      level: newLevel, 
      category: newCategory, 
      isLearningPath: isLearning,
      yearsOfExperience: isLearning ? 0 : 1
    };

    if (isDemo) {
      setSkills([{ ...skillData, id: Math.random().toString() } as Skill, ...skills]);
      setNewSkill('');
      showSuccess(`Added ${newSkill} (Demo)`);
      return;
    }

    setAdding(true);
    try {
      const data = await api.post('/skills', skillData);
      setSkills([data, ...skills]);
      setNewSkill('');
      showSuccess(`Added ${newSkill} to your profile!`);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setAdding(false);
    }
  };

  const removeSkill = async (id: string) => {
    if (isDemo) {
      setSkills(skills.filter(s => s.id !== id));
      return;
    }
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s.id !== id));
      showSuccess("Skill removed");
    } catch (error: any) {
      showError(error.message);
    }
  };

  const getProficiencyValue = (level: string) => {
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
      case 'Intermediate': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Advanced': return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'Expert': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    skills.filter(s => !s.isLearningPath).forEach(skill => {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    });
    return groups;
  }, [skills]);

  const learningPathSkills = useMemo(() => 
    skills.filter(s => s.isLearningPath), 
  [skills]);

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Skills & Expertise</h1>
            <p className="text-muted-foreground">Manage your technical stack and track your learning journey.</p>
          </div>
          <div className="flex gap-3">
            <Card className="border-none shadow-sm bg-primary text-primary-foreground px-4 py-2 flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-80">Total Skills</p>
                <p className="text-lg font-bold leading-none">{skills.length}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Add Skill Section */}
        <Card className="border-none shadow-md overflow-hidden bg-card">
          <div className="h-1 bg-primary" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Plus className="w-5 h-5 text-primary" /> Add New Skill
            </CardTitle>
            <CardDescription>Add a skill you've mastered or one you're currently learning.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1 space-y-2">
                <Label className="text-foreground">Skill Name</Label>
                <Input 
                  placeholder="e.g. Java, Figma" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Proficiency</Label>
                <Select value={newLevel} onValueChange={setNewLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={isLearning ? "secondary" : "outline"}
                  className={cn("flex-1 gap-2", isLearning && "bg-amber-500/10 text-amber-500 border-amber-500/20")}
                  onClick={() => setIsLearning(!isLearning)}
                >
                  <BookOpen className="w-4 h-4" />
                  {isLearning ? "Learning" : "Mastered"}
                </Button>
                <Button 
                  onClick={handleAddSkill} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={adding || !newSkill}
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mastered" className="w-full">
          <TabsList className="bg-muted p-1 rounded-xl mb-6">
            <TabsTrigger value="mastered" className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Star className="w-4 h-4" /> Mastered Skills
            </TabsTrigger>
            <TabsTrigger value="learning" className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Zap className="w-4 h-4" /> Learning Path
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mastered" className="space-y-8 animate-in fade-in duration-500">
            {Object.keys(groupedSkills).length > 0 ? (
              Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Layers className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{category}</h3>
                    <Badge variant="outline" className="text-muted-foreground font-normal border-border">
                      {categorySkills.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <Card key={skill.id} className="border-none shadow-sm hover:shadow-md transition-all group relative overflow-hidden bg-card">
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                <Code2 className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{skill.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Verified Skill</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive h-8 w-8"
                              onClick={() => removeSkill(skill.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className={cn("px-2 py-0.5 rounded-full", getLevelColor(skill.level))}>
                                {skill.level}
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {skill.yearsOfExperience || 1}y exp
                              </span>
                            </div>
                            <Progress value={getProficiencyValue(skill.level)} className="h-1.5" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No mastered skills yet. Add your first one above!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="animate-in fade-in duration-500">
            {learningPathSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPathSkills.map((skill) => (
                  <Card key={skill.id} className="border-none shadow-sm bg-card group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-amber-500/10 rounded-2xl">
                          <Zap className="w-6 h-6 text-amber-500" />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeSkill(skill.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Currently acquiring proficiency in {skill.category}</p>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-amber-500 font-bold">Learning Progress</span>
                          <span className="text-muted-foreground">25%</span>
                        </div>
                        <Progress value={25} className="h-2 bg-amber-500/10" />
                      </div>
                      <Button variant="outline" className="w-full border-amber-500/20 text-amber-500 hover:bg-amber-500/10">
                        Mark as Mastered
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Your learning path is empty. What do you want to learn next?</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Skills;