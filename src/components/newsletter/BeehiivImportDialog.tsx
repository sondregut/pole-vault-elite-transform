
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { importBeehiivSubscribers } from "@/utils/beehiivImport";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  details: Array<any>;
}

export default function BeehiivImportDialog({ onImportComplete }: { onImportComplete: () => void }) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImport = async () => {
    setImporting(true);
    setImportStats(null);
    setImportError(null);

    try {
      console.log("Starting Beehiiv import...");
      const result = await importBeehiivSubscribers();
      console.log("Import result:", result);
      
      if (result.success && result.stats) {
        setImportStats(result.stats);
        toast({
          title: "Import completed",
          description: `Imported ${result.stats.imported} subscribers from Beehiiv`,
        });
        onImportComplete();
      } else {
        const errorMessage = result.error || "Failed to import subscribers from Beehiiv";
        setImportError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
        toast({
          title: "Import failed",
          description: "See details in the dialog",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Import exception:", error);
      setImportError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast({
        title: "Import failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import from Beehiiv
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Subscribers from Beehiiv</DialogTitle>
          <DialogDescription>
            This will import all active subscribers from your Beehiiv account into your local database.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {importStats ? (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Import Results</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc ml-4 mt-2">
                    <li>Total subscribers processed: <strong>{importStats.total}</strong></li>
                    <li>Successfully imported: <strong>{importStats.imported}</strong></li>
                    <li>Skipped (inactive): <strong>{importStats.skipped}</strong></li>
                    <li>Failed: <strong>{importStats.failed}</strong></li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              {importStats.failed > 0 && (
                <p className="text-sm text-muted-foreground">
                  Some subscribers couldn't be imported. Check the console logs for details.
                </p>
              )}
            </div>
          ) : importError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">There was an error importing subscribers:</p>
                  <div className="bg-destructive/10 p-2 rounded text-sm overflow-auto max-h-32">
                    {importError}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <p className="text-center">
              This will import all active subscribers from your Beehiiv account.<br />
              The process can take a few minutes depending on your list size.
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          {!importStats && !importError && (
            <div className="flex gap-4 items-center">
              <Button 
                variant="default" 
                onClick={handleImport}
                disabled={importing}
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Start Import
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={importing}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {(importStats || importError) && (
            <Button 
              variant="default" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          )}
          
          {importError && (
            <Button 
              variant="outline"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Retry Import
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
