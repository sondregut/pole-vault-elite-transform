import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultPoles } from '@/hooks/useVaultData';
import { toast } from 'sonner';
import {
  BarChart3,
  Wrench,
  Plus,
  Search,
  ArrowLeft,
  Upload,
  Activity,
  Edit,
  Trash2,
  Grid3X3,
  List,
  LayoutGrid
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PoleForm from '@/components/vault/equipment/PoleForm';
import PoleImport from '@/components/vault/equipment/PoleImport';

const VaultEquipment = () => {
  const { user, loading: authLoading } = useFirebaseAuth();
  const { poles, loading: polesLoading, error, addPole, updatePole, deletePole, bulkImportPoles } = useVaultPoles(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my-poles');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const location = useLocation();

  const loading = authLoading || polesLoading;

  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['my-poles', 'add-pole', 'bulk-import'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(location.search);
    params.set('tab', newTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/vault/login', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

  // Filter poles based on search term
  const filteredPoles = poles.filter(pole =>
    pole.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pole.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pole.length.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your equipment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/vault/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">
                    <Wrench className="mr-2 h-4 w-4" />
                    Equipment Management
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Your Poles
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and organize your pole vault equipment
                </p>
              </div>

              <div className="flex gap-3">
                <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{poles.length}</div>
                  <div className="text-sm text-gray-600">Total Poles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar & Layout Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search poles by name, brand, or length..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="my-poles">My Poles</TabsTrigger>
              <TabsTrigger value="add-pole">Add Pole</TabsTrigger>
              <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
            </TabsList>

            {/* My Poles Tab */}
            <TabsContent value="my-poles" className="mt-6">
              {error ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6 text-center">
                    <p className="text-red-600">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredPoles.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    {poles.length === 0 ? (
                      <>
                        <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No poles in your library yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Add your first pole to start tracking your equipment
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button onClick={() => handleTabChange('add-pole')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Pole
                          </Button>
                          <Button variant="outline" onClick={() => handleTabChange('bulk-import')}>
                            <Upload className="mr-2 h-4 w-4" />
                            Bulk Import
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No poles match your search
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your search terms
                        </p>
                        <Button variant="outline" onClick={() => setSearchTerm('')}>
                          Clear Search
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPoles.map((pole) => (
                    <Card key={pole.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{pole.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {pole.brand}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Length:</span>
                            <span className="font-medium">{pole.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium">{pole.pounds} lbs</span>
                          </div>
                          {pole.flex && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Flex:</span>
                              <span className="font-medium">{pole.flex}</span>
                            </div>
                          )}
                          {pole.serial && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Serial:</span>
                              <span className="font-medium">{pole.serial}</span>
                            </div>
                          )}
                          {pole.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-600">{pole.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-2">
                  {filteredPoles.map((pole) => (
                    <Card key={pole.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Wrench className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {pole.name}
                                </h3>
                                <Badge variant="secondary" className="flex-shrink-0">
                                  {pole.brand}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span><strong>Length:</strong> {pole.length}</span>
                                <span><strong>Weight:</strong> {pole.pounds} lbs</span>
                                {pole.flex && <span><strong>Flex:</strong> {pole.flex}</span>}
                                {pole.serial && <span><strong>Serial:</strong> {pole.serial}</span>}
                              </div>

                              {pole.notes && (
                                <p className="text-sm text-gray-500 mt-2 truncate">
                                  {pole.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1 flex-shrink-0">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Add Pole Tab */}
            <TabsContent value="add-pole" className="mt-6">
              <PoleForm onSave={addPole} />
            </TabsContent>

            {/* Bulk Import Tab */}
            <TabsContent value="bulk-import" className="mt-6">
              <PoleImport onImport={bulkImportPoles} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default VaultEquipment;