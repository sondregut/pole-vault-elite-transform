
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
  const { toast } = useToast();

  const handleImport = async () => {
    setImporting(true);
    setImportStats(null);

    try {
      const result = await importBeehiivSubscribers();
      
      if (result.success) {
        setImportStats(result.stats);
        toast({
          title: "Import completed",
          description: `Imported ${result.stats.imported} subscribers from Beehiiv`,
        });
        onImportComplete();
      } else {
        toast({
          title: "Import failed",
          description: result.error || "Failed to import subscribers from Beehiiv",
          variant: "destructive",
        });
      }
    } catch (error) {
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
          ) : (
            <p className="text-center">
              This will import all active subscribers from your Beehiiv account.<br />
              The process can take a few minutes depending on your list size.
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          {!importStats && (
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
          
          {importStats && (
            <Button 
              variant="default" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
