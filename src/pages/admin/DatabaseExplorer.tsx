"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, Search, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const DatabaseExplorer = () => {
  const [activeTable, setActiveTable] = useState('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tables = [
    { id: 'users', name: 'Users', endpoint: '/users' },
    { id: 'projects', name: 'Projects', endpoint: '/projects' },
    { id: 'skills', name: 'Skills', endpoint: '/skills' },
    { id: 'certifications', name: 'Certifications', endpoint: '/certifications' },
  ];

  const fetchData = async (tableId: string) => {
    setLoading(true);
    try {
      const endpoint = tables.find(t => t.id === tableId)?.endpoint || '/users';
      const result = await api.get(endpoint);
      setData(Array.isArray(result) ? result : []);
    } catch (error: any) {
      showError(`Failed to fetch ${tableId}: ${error.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTable);
  }, [activeTable]);

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              Database Explorer
            </h1>
            <p className="text-muted-foreground">Inspect raw data across all system tables.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => fetchData(activeTable)} 
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        <Card className="border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-slate-950 text-white p-4">
            <div className="flex items-center gap-2 text-sm font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">mysql></span>
              <span>SELECT * FROM {activeTable};</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTable} onValueChange={setActiveTable} className="w-full">
              <div className="px-6 pt-4 border-b border-border bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                  <TabsList className="bg-muted">
                    {tables.map(table => (
                      <TabsTrigger key={table.id} value={table.id} className="data-[state=active]:bg-card">
                        {table.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Filter results..." 
                      className="pl-10 h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {columns.map(col => (
                        <TableHead key={col} className="font-mono text-xs uppercase tracking-wider text-foreground">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length || 1} className="h-32 text-center">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length > 0 ? (
                      filteredData.map((row, i) => (
                        <TableRow key={i} className="hover:bg-muted/30 border-border">
                          {columns.map(col => (
                            <TableCell key={col} className="font-mono text-xs max-w-[200px] truncate text-muted-foreground">
                              {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length || 1} className="h-32 text-center text-muted-foreground">
                          No records found in {activeTable}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DatabaseExplorer;