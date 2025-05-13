
import React from "react";
import DownloadCard from "./DownloadCard";

interface DigitalProduct {
  id: string;
  product_files: {
    id: string;
    product_id: number;
    file_name: string;
    file_type: string;
  };
  download_count: number;
  downloaded_at: string | null;
}

interface DownloadsListProps {
  downloads: DigitalProduct[];
  loading: boolean;
  onDownload: (fileId: string, fileName: string) => Promise<void>;
  onShopNow: () => void;
}

const DownloadsList: React.FC<DownloadsListProps> = ({
  downloads,
  loading,
  onDownload,
  onShopNow,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (downloads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-lg mb-6">You don't have any digital products yet</p>
        <button 
          className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-button text-sm font-medium bg-[#3176FF] text-primary-foreground hover:bg-[#1E293B] h-10 px-4 py-2"
          onClick={onShopNow}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {downloads.map((download) => (
        <DownloadCard
          key={download.id}
          id={download.id}
          fileId={download.product_files.id}
          fileName={download.product_files.file_name}
          fileType={download.product_files.file_type}
          downloadCount={download.download_count}
          downloadedAt={download.downloaded_at}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default DownloadsList;
