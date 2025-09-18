import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pole, POLE_BRANDS } from '@/types/vault';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isEditing ? 'Edit Pole' : 'Add New Pole'}
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pole Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Pole Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. My UCS 14'6 pole"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {POLE_BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
            </div>

            {/* Length */}
            <div className="space-y-2">
              <Label htmlFor="length">Length *</Label>
              <Input
                id="length"
                value={formData.length}
                onChange={(e) => handleInputChange('length', e.target.value)}
                placeholder="14'6 or 4.57m"
                className={errors.length ? 'border-red-500' : ''}
              />
              {errors.length && <p className="text-sm text-red-500">{errors.length}</p>}
              <p className="text-xs text-gray-500">Format: 14&apos;6&quot; (imperial) or 4.57m (metric)</p>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="pounds">Weight (lbs) *</Label>
              <Input
                id="pounds"
                type="number"
                min="100"
                max="300"
                value={formData.pounds}
                onChange={(e) => handleInputChange('pounds', e.target.value)}
                placeholder="170"
                className={errors.pounds ? 'border-red-500' : ''}
              />
              {errors.pounds && <p className="text-sm text-red-500">{errors.pounds}</p>}
            </div>

            {/* Flex */}
            <div className="space-y-2">
              <Label htmlFor="flex">Flex Rating</Label>
              <Input
                id="flex"
                type="number"
                step="0.1"
                value={formData.flex}
                onChange={(e) => handleInputChange('flex', e.target.value)}
                placeholder="14.2"
                className={errors.flex ? 'border-red-500' : ''}
              />
              {errors.flex && <p className="text-sm text-red-500">{errors.flex}</p>}
              <p className="text-xs text-gray-500">Optional: Pole flexibility rating</p>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serial">Serial Number</Label>
              <Input
                id="serial"
                value={formData.serial}
                onChange={(e) => handleInputChange('serial', e.target.value)}
                placeholder="S12345"
              />
              <p className="text-xs text-gray-500">Optional: For warranty and identification</p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Training pole - good condition, needs new tape..."
              rows={3}
            />
            <p className="text-xs text-gray-500">Optional: Any additional information about this pole</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Pole' : 'Add Pole'}
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PoleForm;