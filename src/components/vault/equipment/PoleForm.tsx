import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pole, POLE_BRANDS } from '@/types/vault';
import { toast } from 'sonner';
import { Loader2, Plus, X, Ruler, Weight, Hash, FileText, Pencil } from 'lucide-react';

interface PoleFormProps {
  pole?: Pole;
  onSave: (poleData: Omit<Pole, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error: string | null }>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const PoleForm: React.FC<PoleFormProps> = ({ pole, onSave, onCancel, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: pole?.name || '',
    brand: pole?.brand || '',
    length: pole?.length || '',
    pounds: pole?.pounds || '',
    flex: pole?.flex || '',
    serial: pole?.serial || '',
    notes: pole?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pole name is required';
    }

    if (!formData.brand) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.length.trim()) {
      newErrors.length = 'Length is required';
    } else {
      // Validate length format (imperial OR metric)
      const lengthPattern = /^(\d{1,2}'(\d{1,2}\"?)?|\d{1,2}\.\d{2}m?|\d\.\d{2}m?)$/;
      if (!lengthPattern.test(formData.length)) {
        newErrors.length = 'Invalid format. Use 14\'6" or 4.57m or 4.57';
      }
    }

    if (!formData.pounds.trim()) {
      newErrors.pounds = 'Weight is required';
    } else {
      const weight = parseFloat(formData.pounds);
      if (isNaN(weight) || weight < 100 || weight > 300) {
        newErrors.pounds = 'Weight must be between 100-300 lbs';
      }
    }

    // Flex is optional, but validate if provided
    if (formData.flex && isNaN(parseFloat(formData.flex))) {
      newErrors.flex = 'Flex must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await onSave(formData);

      if (result.success) {
        toast.success(isEditing ? 'Pole updated successfully!' : 'Pole added successfully!');

        // Reset form if adding new pole
        if (!isEditing) {
          setFormData({
            name: '',
            brand: '',
            length: '',
            pounds: '',
            flex: '',
            serial: '',
            notes: ''
          });
        }

        if (onCancel) {
          onCancel();
        }
      } else {
        toast.error(result.error || 'Failed to save pole');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-vault-border-light flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditing ? 'bg-amber-50' : 'bg-vault-primary-muted'}`}>
            {isEditing ? (
              <Pencil className="h-5 w-5 text-amber-600" />
            ) : (
              <Plus className="h-5 w-5 text-vault-primary" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-vault-text">
              {isEditing ? 'Edit Pole' : 'Add New Pole'}
            </h2>
            <p className="text-sm text-vault-text-muted">
              {isEditing ? 'Update your pole details' : 'Enter your pole specifications'}
            </p>
          </div>
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-vault-text-muted hover:text-vault-text hover:bg-vault-primary-muted rounded-lg">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Primary Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pole Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name" className="text-sm font-medium text-vault-text mb-1.5 block">
              Pole Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Competition UCS 16'5"
              className={`rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Brand */}
          <div>
            <Label htmlFor="brand" className="text-sm font-medium text-vault-text mb-1.5 block">
              Brand <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
              <SelectTrigger className={`rounded-xl border-vault-border ${errors.brand ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {POLE_BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
          </div>

          {/* Length */}
          <div>
            <Label htmlFor="length" className="text-sm font-medium text-vault-text mb-1.5 flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-vault-text-muted" />
              Length <span className="text-red-500">*</span>
            </Label>
            <Input
              id="length"
              value={formData.length}
              onChange={(e) => handleInputChange('length', e.target.value)}
              placeholder="16'5 or 5.00m"
              className={`rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary ${errors.length ? 'border-red-500' : ''}`}
            />
            {errors.length && <p className="text-xs text-red-500 mt-1">{errors.length}</p>}
          </div>
        </div>

        {/* Specifications Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Weight */}
          <div>
            <Label htmlFor="pounds" className="text-sm font-medium text-vault-text mb-1.5 flex items-center gap-1.5">
              <Weight className="h-3.5 w-3.5 text-vault-text-muted" />
              Weight <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="pounds"
                type="number"
                min="100"
                max="300"
                value={formData.pounds}
                onChange={(e) => handleInputChange('pounds', e.target.value)}
                placeholder="183"
                className={`rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary pr-10 ${errors.pounds ? 'border-red-500' : ''}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-vault-text-muted">lbs</span>
            </div>
            {errors.pounds && <p className="text-xs text-red-500 mt-1">{errors.pounds}</p>}
          </div>

          {/* Flex */}
          <div>
            <Label htmlFor="flex" className="text-sm font-medium text-vault-text mb-1.5 block">
              Flex
            </Label>
            <Input
              id="flex"
              type="number"
              step="0.1"
              value={formData.flex}
              onChange={(e) => handleInputChange('flex', e.target.value)}
              placeholder="18.3"
              className={`rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary ${errors.flex ? 'border-red-500' : ''}`}
            />
            {errors.flex && <p className="text-xs text-red-500 mt-1">{errors.flex}</p>}
          </div>

          {/* Serial Number */}
          <div className="col-span-2">
            <Label htmlFor="serial" className="text-sm font-medium text-vault-text mb-1.5 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-vault-text-muted" />
              Serial Number
            </Label>
            <Input
              id="serial"
              value={formData.serial}
              onChange={(e) => handleInputChange('serial', e.target.value)}
              placeholder="Optional"
              className="rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary"
            />
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <Label htmlFor="notes" className="text-sm font-medium text-vault-text mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-vault-text-muted" />
            Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Competition pole, good condition..."
            rows={2}
            className="rounded-xl border-vault-border focus:border-vault-primary focus:ring-vault-primary resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-vault-primary hover:bg-vault-primary-dark text-white font-semibold py-5 rounded-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              <>
                {isEditing ? (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pole
                  </>
                )}
              </>
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-vault-border text-vault-text-secondary hover:bg-vault-primary-muted rounded-xl px-6"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PoleForm;