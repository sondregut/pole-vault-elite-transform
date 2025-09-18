import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ParsedPole } from '@/types/vault';
import { downloadTemplate, parseExcelFile, convertToFirebaseFormat } from '@/utils/excelTemplate';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface PoleImportProps {
  onImport: (polesData: any[]) => Promise<{ success: boolean; error: string | null; count: number }>;
}

const PoleImport: React.FC<PoleImportProps> = ({ onImport }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'success'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedPoles, setParsedPoles] = useState<ParsedPole[]>([]);
  const [importResults, setImportResults] = useState<{ success: boolean; count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Handle template download
  const handleDownloadTemplate = () => {
    try {
      downloadTemplate();
      toast.success('Template downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download template');
      console.error('Template download error:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[PoleImport] File upload triggered');
    const uploadedFile = event.target.files?.[0];

    if (!uploadedFile) {
      console.log('[PoleImport] No file selected');
      return;
    }

    console.log('[PoleImport] File selected:', uploadedFile.name, uploadedFile.size, 'bytes');

    // Validate file type
    if (!uploadedFile.name.endsWith('.xlsx') && !uploadedFile.name.endsWith('.xls')) {
      const errorMsg = 'Please upload an Excel file (.xlsx or .xls)';
      console.error('[PoleImport] Invalid file type:', uploadedFile.name);
      setErrors([errorMsg]);
      toast.error(errorMsg);
      return;
    }

    setFile(uploadedFile);
    setLoading(true);
    setErrors([]);
    console.log('[PoleImport] Starting to parse file...');

    try {
      const parsed = await parseExcelFile(uploadedFile);
      console.log('[PoleImport] Parse successful:', parsed.length, 'poles found');

      setParsedPoles(parsed);
      setStep('preview');

      const validCount = parsed.filter(p => p.isValid).length;
      const invalidCount = parsed.filter(p => !p.isValid).length;

      console.log('[PoleImport] Validation results:', validCount, 'valid,', invalidCount, 'invalid');
      toast.success(`Parsed ${parsed.length} poles: ${validCount} valid, ${invalidCount} with errors`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to parse file';
      console.error('[PoleImport] Parse error:', error);
      setErrors([errorMsg]);
      toast.error('Failed to parse Excel file: ' + errorMsg);
    } finally {
      setLoading(false);
      console.log('[PoleImport] Parse process completed');
    }
  }, []);

  // Handle import confirmation
  const handleImport = async () => {
    const validPoles = parsedPoles.filter(pole => pole.isValid);

    if (validPoles.length === 0) {
      toast.error('No valid poles to import');
      return;
    }

    setLoading(true);
    setStep('importing');

    try {
      const firebaseData = convertToFirebaseFormat(validPoles);
      const result = await onImport(firebaseData);

      if (result.success) {
        setImportResults({ success: true, count: result.count });
        setStep('success');
        toast.success(`Successfully imported ${result.count} poles!`);
      } else {
        setErrors([result.error || 'Import failed']);
        setStep('preview');
        toast.error('Failed to import poles');
      }
    } catch (error) {
      setErrors(['An unexpected error occurred during import']);
      setStep('preview');
      toast.error('Import failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset to start over
  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setParsedPoles([]);
    setImportResults(null);
    setErrors([]);
  };

  // Upload Step
  if (step === 'upload') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import Poles
          </CardTitle>
          <p className="text-gray-600">Import multiple poles from an Excel file</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Template */}
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <FileSpreadsheet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Step 1: Download Template
            </h3>
            <p className="text-gray-600 mb-4">
              Get the Excel template with sample data and validation rules
            </p>
            <Button onClick={handleDownloadTemplate} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download Excel Template
            </Button>
          </div>

          {/* Upload File */}
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Step 2: Upload Your File
            </h3>
            <p className="text-gray-600 mb-4">
              Fill out the template and upload your completed Excel file
            </p>

            <div className="space-y-4">
              {/* File Input */}
              <div className="relative inline-block">
                <input
                  id="excel-file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  disabled={loading}
                  className="relative pointer-events-none"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Excel File
                    </>
                  )}
                </Button>
              </div>

              {/* Alternative: Direct button */}
              <div className="text-sm text-gray-500">
                Or click{' '}
                <label
                  htmlFor="excel-file-input"
                  className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                >
                  here to browse files
                </label>
              </div>

              {/* File info if selected */}
              {file && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Use the downloaded template to ensure proper formatting.
              The file must have Brand, Length, and Weight columns. All other fields are optional.
            </AlertDescription>
          </Alert>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // Preview Step
  if (step === 'preview') {
    const validPoles = parsedPoles.filter(p => p.isValid);
    const invalidPoles = parsedPoles.filter(p => !p.isValid);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Preview Import Data
            </span>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </CardTitle>
          <div className="flex gap-4">
            <Badge variant="default" className="bg-green-600">
              {validPoles.length} Valid
            </Badge>
            {invalidPoles.length > 0 && (
              <Badge variant="destructive">
                {invalidPoles.length} Invalid
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Found {parsedPoles.length} poles in your file.
              {validPoles.length > 0 && ` ${validPoles.length} poles are ready to import.`}
              {invalidPoles.length > 0 && ` ${invalidPoles.length} poles have errors and will be skipped.`}
            </AlertDescription>
          </Alert>

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Row</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Flex</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedPoles.map((pole, index) => (
                  <TableRow key={index} className={pole.isValid ? '' : 'bg-red-50'}>
                    <TableCell>
                      {pole.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>{pole.rowNumber}</TableCell>
                    <TableCell>{pole.brand}</TableCell>
                    <TableCell>{pole.length}</TableCell>
                    <TableCell>{pole.pounds}</TableCell>
                    <TableCell>{pole.flex}</TableCell>
                    <TableCell>{pole.serial}</TableCell>
                    <TableCell className="max-w-xs truncate">{pole.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Error Details */}
          {invalidPoles.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <strong>Poles with errors:</strong>
                  {invalidPoles.map((pole, index) => (
                    <div key={index} className="text-sm">
                      <strong>Row {pole.rowNumber}:</strong> {pole.errors.join(', ')}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={validPoles.length === 0 || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import {validPoles.length} Poles
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Importing Step
  if (step === 'importing') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Importing Your Poles...
          </h3>
          <p className="text-gray-600">
            Please wait while we add your poles to the database
          </p>
        </CardContent>
      </Card>
    );
  }

  // Success Step
  if (step === 'success') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Import Successful!
          </h3>
          <p className="text-gray-600 mb-6">
            Successfully imported {importResults?.count} poles to your equipment library
          </p>
          <Button onClick={handleReset}>
            <Upload className="mr-2 h-4 w-4" />
            Import More Poles
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default PoleImport;