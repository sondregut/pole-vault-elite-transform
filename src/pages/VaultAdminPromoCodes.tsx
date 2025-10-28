import { useState } from 'react';
import { usePromoCodes } from '@/hooks/useAdminData';
import { createPromoCode, updatePromoCode, deletePromoCode } from '@/services/adminService';
import { PromoCode, PromoCodeFormData } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ticket, Plus, Edit2, Trash2, Users, Calendar, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const VaultAdminPromoCodes = () => {
  const { promoCodes, loading, refresh } = usePromoCodes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<PromoCodeFormData>({
    code: '',
    type: 'lifetime',
    active: true,
    usesRemaining: 'unlimited',
    expiresAt: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'lifetime',
      active: true,
      usesRemaining: 'unlimited',
      expiresAt: '',
      description: '',
    });
    setEditingCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCode) {
        const result = await updatePromoCode(editingCode.id, {
          ...formData,
          code: formData.code.toUpperCase(),
        });
        if (result.success) {
          toast.success('Promo code updated successfully');
          setIsCreateDialogOpen(false);
          resetForm();
          refresh();
        } else {
          toast.error(result.error || 'Failed to update promo code');
        }
      } else {
        const result = await createPromoCode(formData);
        if (result.success) {
          toast.success('Promo code created successfully');
          setIsCreateDialogOpen(false);
          resetForm();
          refresh();
        } else {
          toast.error(result.error || 'Failed to create promo code');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      type: code.type,
      active: code.active,
      usesRemaining: code.usesRemaining,
      expiresAt: code.expiresAt || '',
      description: code.description || '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleToggleActive = async (code: PromoCode) => {
    const result = await updatePromoCode(code.id, { active: !code.active });
    if (result.success) {
      toast.success(`Promo code ${code.active ? 'deactivated' : 'activated'}`);
      refresh();
    } else {
      toast.error(result.error || 'Failed to update promo code');
    }
  };

  const handleDelete = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this promo code? This action cannot be undone.')) {
      return;
    }

    const result = await deletePromoCode(codeId);
    if (result.success) {
      toast.success('Promo code deleted successfully');
      refresh();
    } else {
      toast.error(result.error || 'Failed to delete promo code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Promo Codes</h2>
          <p className="text-gray-600 mt-1">Create and manage promotional codes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#00A6FF] hover:bg-[#0095E8]">
              <Plus className="w-4 h-4" />
              Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">{editingCode ? 'Edit' : 'Create'} Promo Code</DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingCode ? 'Update the promo code details below.' : 'Fill in the details to create a new promo code.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-gray-900">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VIPACCESS2025"
                  required
                  disabled={!!editingCode}
                  className="bg-white border-gray-300 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Uppercase letters and numbers only</p>
              </div>

              <div>
                <Label htmlFor="type" className="text-gray-900">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'lifetime' | 'trial_extension') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="lifetime">Lifetime Access</SelectItem>
                    <SelectItem value="trial_extension">Trial Extension (14 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="usesRemaining" className="text-gray-900">Uses Remaining</Label>
                <Input
                  id="usesRemaining"
                  value={formData.usesRemaining}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      usesRemaining: value === 'unlimited' || value === '' ? 'unlimited' : parseInt(value) || 0,
                    });
                  }}
                  placeholder="unlimited or number"
                  className="bg-white border-gray-300 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Type "unlimited" or enter a number</p>
              </div>

              <div>
                <Label htmlFor="expiresAt" className="text-gray-900">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : '' })
                  }
                  className="bg-white border-gray-300 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-900">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="For influencers and brand ambassadors"
                  className="bg-white border-gray-300 mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="active" className="cursor-pointer text-gray-900">Active</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#00A6FF] hover:bg-[#0095E8]">
                  {isSubmitting ? 'Saving...' : editingCode ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Promo Codes List */}
      {promoCodes.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">No promo codes yet</p>
            <p className="text-sm text-gray-500 mt-1">Create your first promo code to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {promoCodes.map((code) => (
            <Card key={code.id} className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-mono text-gray-900">{code.code}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={code.active ? 'default' : 'secondary'} className={code.active ? 'bg-green-500' : ''}>
                        {code.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {code.type === 'lifetime' ? 'Lifetime' : 'Trial Extension'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(code)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(code.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {code.description && (
                  <p className="text-sm text-gray-600">{code.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>
                      {code.usesRemaining === 'unlimited' ? 'Unlimited' : code.usesRemaining} uses left
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-500" />
                    <span>{code.usedBy.length} redeemed</span>
                  </div>
                </div>
                {code.expiresAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {new Date(code.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <Button
                    onClick={() => handleToggleActive(code)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    {code.active ? (
                      <>
                        <X className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultAdminPromoCodes;
