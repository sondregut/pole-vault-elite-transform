import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultPoles } from '@/hooks/useVaultData';
import { toast } from 'sonner';
import {
  BarChart3,
  Wrench,
  Plus,
  Search,
  Upload,
  Activity,
  Edit,
  Trash2,
  Grid3X3,
  List,
  LayoutGrid,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';
import PoleForm from '@/components/vault/equipment/PoleForm';
import PoleImport from '@/components/vault/equipment/PoleImport';

const VaultEquipment = () => {
  const { user } = useFirebaseAuth();
  const { poles, loading: polesLoading, error, addPole, updatePole, deletePole, bulkImportPoles } = useVaultPoles(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my-poles');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [flexFilter, setFlexFilter] = useState<string>('all');
  const [editingPole, setEditingPole] = useState<typeof poles[0] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loading = polesLoading;

  // Handle editing a pole
  const handleEditPole = (pole: typeof poles[0]) => {
    setEditingPole(pole);
  };

  // Handle saving an edited pole
  const handleSaveEditedPole = async (poleData: Omit<typeof poles[0], 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingPole) return { success: false, error: 'No pole selected for editing' };
    const result = await updatePole(editingPole.id, poleData);
    if (result.success) {
      setEditingPole(null);
    }
    return result;
  };

  // Handle deleting a pole
  const handleDeletePole = async (poleId: string, poleName: string) => {
    if (window.confirm(`Are you sure you want to delete "${poleName}"? This action cannot be undone.`)) {
      const result = await deletePole(poleId);
      if (result.success) {
        toast.success('Pole deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete pole');
      }
    }
  };

  // Sortable header component
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => {
    const isActive = sortField === field;
    const Icon = isActive
      ? (sortDirection === 'asc' ? ArrowUp : ArrowDown)
      : ArrowUpDown;

    return (
      <TableHead
        className="cursor-pointer hover:bg-vault-primary-muted select-none"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2">
          {children}
          <Icon className={`h-4 w-4 ${isActive ? 'text-vault-primary' : 'text-vault-text-muted'}`} />
        </div>
      </TableHead>
    );
  };

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

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get unique values for filters
  const uniqueBrands = [...new Set(poles.map(pole => pole.brand))].sort();
  const uniqueFlex = [...new Set(poles.map(pole => pole.flex).filter(Boolean))].sort();

  // Filter and sort poles
  const filteredAndSortedPoles = poles
    .filter(pole => {
      const matchesSearch =
        pole.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pole.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pole.length.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pole.serial && pole.serial.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBrand = brandFilter === 'all' || pole.brand === brandFilter;
      const matchesFlex = flexFilter === 'all' || pole.flex === flexFilter;

      return matchesSearch && matchesBrand && matchesFlex;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a];
      let bValue: any = b[sortField as keyof typeof b];

      // Handle numeric sorting for weight
      if (sortField === 'pounds') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      // Handle length sorting (extract numeric value)
      else if (sortField === 'length') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      // Handle string sorting
      else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-vault-primary-muted text-vault-primary border-vault-primary/20">
          <Wrench className="mr-2 h-4 w-4" />
          Equipment Management
            </Badge>
            </div>
            <h1 className="text-3xl font-bold text-vault-text">
            Manage Your Poles
            </h1>
            <p className="text-vault-text-secondary mt-1">
            Track and organize your pole vault equipment
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white rounded-xl px-4 py-3 border border-vault-border-light shadow-vault">
            <div className="text-2xl font-bold text-vault-primary">
          {filteredAndSortedPoles.length}
          {filteredAndSortedPoles.length !== poles.length && (
            <span className="text-lg text-vault-text-muted">/{poles.length}</span>
          )}
            </div>
            <div className="text-sm text-vault-text-secondary">
          {filteredAndSortedPoles.length !== poles.length ? 'Filtered Poles' : 'Total Poles'}
            </div>
            </div>
          </div>
            </div>
          </div>

          {/* Search Bar & Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vault-text-muted" />
            <Input
            placeholder="Search poles by name, brand, length, or serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-vault-border rounded-xl focus:border-vault-primary focus:ring-vault-primary"
            />
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center bg-white rounded-xl border border-vault-border-light shadow-vault-sm p-1">
            <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`h-8 px-3 rounded-lg ${viewMode === 'grid' ? 'bg-vault-primary hover:bg-vault-primary-dark text-white' : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'}`}
            >
            <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`h-8 px-3 rounded-lg ${viewMode === 'list' ? 'bg-vault-primary hover:bg-vault-primary-dark text-white' : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'}`}
            >
            <List className="h-4 w-4" />
            </Button>
          </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-vault-text-muted" />
            <span className="text-sm font-medium text-vault-text-secondary">Filters:</span>
          </div>

          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[180px] border-vault-border rounded-xl">
            <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-vault-border">
            <SelectItem value="all">All Brands</SelectItem>
            {uniqueBrands.map(brand => (
          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
            </SelectContent>
          </Select>

          <Select value={flexFilter} onValueChange={setFlexFilter}>
            <SelectTrigger className="w-[180px] border-vault-border rounded-xl">
            <SelectValue placeholder="All Flex Ratings" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-vault-border">
            <SelectItem value="all">All Flex Ratings</SelectItem>
            {uniqueFlex.map(flex => (
          <SelectItem key={flex} value={flex}>{flex}</SelectItem>
            ))}
            </SelectContent>
          </Select>

          {(brandFilter !== 'all' || flexFilter !== 'all' || searchTerm) && (
            <Button
            variant="outline"
            size="sm"
            onClick={() => {
          setBrandFilter('all');
          setFlexFilter('all');
          setSearchTerm('');
            }}
            className="h-8 border-vault-primary text-vault-primary hover:bg-vault-primary-muted rounded-lg"
            >
            Clear Filters
            </Button>
          )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 max-w-md bg-vault-primary-muted rounded-xl p-1">
          <TabsTrigger value="my-poles" className="rounded-lg data-[state=active]:bg-vault-primary data-[state=active]:text-white">My Poles</TabsTrigger>
          <TabsTrigger value="add-pole" className="rounded-lg data-[state=active]:bg-vault-primary data-[state=active]:text-white">Add Pole</TabsTrigger>
          <TabsTrigger value="bulk-import" className="rounded-lg data-[state=active]:bg-vault-primary data-[state=active]:text-white">Bulk Import</TabsTrigger>
            </TabsList>

            {/* My Poles Tab */}
            <TabsContent value="my-poles" className="mt-6">
          {error ? (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
          <p className="text-vault-error">{error}</p>
            </div>
          ) : filteredAndSortedPoles.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light p-12 text-center">
          {poles.length === 0 ? (
            <>
              <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-vault-primary" />
              </div>
              <h3 className="text-lg font-bold text-vault-text mb-2">
                No poles in your library yet
              </h3>
              <p className="text-vault-text-secondary mb-6">
                Add your first pole to start tracking your equipment
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => handleTabChange('add-pole')} className="bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Pole
                </Button>
                <Button variant="outline" onClick={() => handleTabChange('bulk-import')} className="border-vault-primary text-vault-primary hover:bg-vault-primary-muted font-semibold rounded-xl">
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Import
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-vault-primary" />
              </div>
              <h3 className="text-lg font-bold text-vault-text mb-2">
                No poles match your search
              </h3>
              <p className="text-vault-text-secondary mb-4">
                Try adjusting your search terms
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')} className="border-vault-primary text-vault-primary hover:bg-vault-primary-muted font-semibold rounded-xl">
                Clear Search
              </Button>
            </>
          )}
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPoles.map((pole) => (
          <div key={pole.id} className="bg-white rounded-2xl shadow-vault border border-vault-border-light hover:shadow-vault-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
            <div className="p-6 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-vault-text">{pole.name}</h3>
                  <Badge className="mt-1 bg-vault-primary-muted text-vault-primary border-vault-primary/20">
                    {pole.brand}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-vault-text-muted hover:text-vault-primary hover:bg-vault-primary-muted rounded-lg"
                    onClick={() => handleEditPole(pole)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-vault-error hover:bg-red-50 rounded-lg"
                    onClick={() => handleDeletePole(pole.id, pole.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-vault-text-muted">Length:</span>
                  <span className="font-medium text-vault-text">{pole.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-vault-text-muted">Weight:</span>
                  <span className="font-medium text-vault-text">{pole.pounds} lbs</span>
                </div>
                {pole.flex && (
                  <div className="flex justify-between text-sm">
                    <span className="text-vault-text-muted">Flex:</span>
                    <span className="font-medium text-vault-text">{pole.flex}</span>
                  </div>
                )}
                {pole.serial && (
                  <div className="flex justify-between text-sm">
                    <span className="text-vault-text-muted">Serial:</span>
                    <span className="font-medium text-vault-text">{pole.serial}</span>
                  </div>
                )}
                {pole.notes && (
                  <div className="mt-3 pt-3 border-t border-vault-border-light">
                    <p className="text-sm text-vault-text-secondary">{pole.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
            ))}
            </div>
          ) : (
            // Table View
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
            <Table>
          <TableHeader>
            <TableRow className="bg-vault-primary-muted/50">
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="brand">Brand</SortableHeader>
              <SortableHeader field="length">Length</SortableHeader>
              <SortableHeader field="pounds">Weight</SortableHeader>
              <SortableHeader field="flex">Flex</SortableHeader>
              <SortableHeader field="serial">Serial</SortableHeader>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPoles.map((pole) => (
              <TableRow key={pole.id} className="hover:bg-vault-primary-muted/30">
                <TableCell className="font-medium text-vault-text">{pole.name}</TableCell>
                <TableCell>
                  <Badge className="bg-vault-primary-muted text-vault-primary border-vault-primary/20">{pole.brand}</Badge>
                </TableCell>
                <TableCell className="text-vault-text-secondary">{pole.length}</TableCell>
                <TableCell className="text-vault-text-secondary">{pole.pounds} lbs</TableCell>
                <TableCell className="text-vault-text-secondary">{pole.flex || '-'}</TableCell>
                <TableCell className="font-mono text-sm text-vault-text-muted">{pole.serial || '-'}</TableCell>
                <TableCell className="max-w-xs">
                  {pole.notes ? (
                    <span className="text-sm text-vault-text-secondary truncate block" title={pole.notes}>
                      {pole.notes}
                    </span>
                  ) : (
                    <span className="text-vault-text-muted">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-vault-text-muted hover:text-vault-primary hover:bg-vault-primary-muted rounded-lg"
                      onClick={() => handleEditPole(pole)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-vault-error hover:bg-red-50 rounded-lg"
                      onClick={() => handleDeletePole(pole.id, pole.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            </Table>
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

          {/* Edit Pole Modal */}
          {editingPole && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-vault-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <PoleForm
                  pole={editingPole}
                  onSave={handleSaveEditedPole}
                  onCancel={() => setEditingPole(null)}
                  isEditing
                />
              </div>
            </div>
          )}
    </div>
  );
};

export default VaultEquipment;