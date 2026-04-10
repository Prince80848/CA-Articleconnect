import { useState } from 'react';
import { HiDocumentText, HiDownload, HiEye } from 'react-icons/hi';

/**
 * Converts a Cloudinary raw URL into a Google Docs Viewer URL so the PDF
 * opens inline in the browser tab instead of force-downloading.
 */
function getViewerUrl(url) {
    if (!url) return null;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

/**
 * ResumeButton – renders View and optionally Download buttons for a resume.
 *
 * Props:
 *   resumeUrl  – the Cloudinary / raw URL stored in the database
 *   canDownload – true for firm/admin roles; shows the Download button
 *   compact    – smaller styling variant (default false)
 */
export default function ResumeButton({ resumeUrl, canDownload = false, compact = false }) {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!resumeUrl) return null;

    const viewerUrl = getViewerUrl(resumeUrl);
    const btnBase = compact
        ? 'flex items-center gap-1 text-xs font-medium border rounded-lg px-2 py-1 transition-colors relative'
        : 'flex items-center gap-1.5 text-sm font-medium border rounded-lg px-3 py-1.5 transition-colors relative';

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            setIsDownloading(true);
            const response = await fetch(resumeUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `resume-${Date.now()}.pdf`; // Force proper PDF extension
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed natively, falling back to new tab:', error);
            window.open(resumeUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* View button – opens in Google Docs viewer for ALL roles */}
            <a
                href={viewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Resume"
                className={`${btnBase} text-primary-600 border-primary-200 hover:bg-primary-50`}
            >
                <HiEye className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                View
            </a>

            {/* Download button – only visible for firm/admin */}
            {canDownload && (
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    title="Download Resume"
                    className={`${btnBase} text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50`}
                >
                    {isDownloading ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <HiDownload className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download'}
                </button>
            )}
        </div>
    );
}
