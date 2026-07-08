import { useState } from 'react';
import { HiDownload, HiEye } from 'react-icons/hi';
import api from '../services/api';

/**
 * Extracts the filename from a Cloudinary URL.
 * e.g. .../cahire_resumes/resume-1783528395958.pdf → resume-1783528395958.pdf
 */
function getFileName(url) {
    if (!url) return 'resume.pdf';
    const name = url.split('/').pop().split('?')[0];
    return name || 'resume.pdf';
}

/**
 * ResumeButton – renders View and Download buttons for a resume.
 *
 * Props:
 *   resumeUrl   – Cloudinary raw URL stored in the database
 *   canDownload – show Download button (true for firm/admin)
 *   compact     – smaller styling variant (default false)
 */
export default function ResumeButton({ resumeUrl, canDownload = false, compact = false }) {
    const [downloading, setDownloading] = useState(false);

    if (!resumeUrl) return null;

    const fileName = getFileName(resumeUrl);

    const btnBase = compact
        ? 'inline-flex items-center gap-1 text-xs font-medium border rounded-lg px-2 py-1 transition-colors'
        : 'inline-flex items-center gap-1.5 text-sm font-medium border rounded-lg px-3 py-1.5 transition-colors';

    /**
     * Download via our backend proxy (/api/students/resume-download?url=…).
     * The backend fetches the Cloudinary raw URL server-side and streams it back
     * with Content-Disposition: attachment — zero CORS issues.
     */
    const handleDownload = async () => {
        try {
            setDownloading(true);
            const { data } = await api.get('/students/resume-download', {
                params: { url: encodeURIComponent(resumeUrl) },
                responseType: 'blob',
            });

            const blobUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download failed:', err);
            // Fallback: open in new tab so user can save manually
            window.open(resumeUrl, '_blank', 'noopener,noreferrer');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/*
              VIEW: Opens the Cloudinary raw URL directly in a new browser tab.
              Chrome/Firefox/Edge have built-in PDF renderers that work perfectly
              for any publicly accessible URL — no Google Docs Viewer needed.
            */}
            <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Resume"
                className={`${btnBase} text-primary-600 border-primary-200 hover:bg-primary-50`}
            >
                <HiEye className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                View
            </a>

            {/* DOWNLOAD: proxy through our backend to force Content-Disposition: attachment */}
            {canDownload && (
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    title="Download Resume"
                    className={`${btnBase} text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {downloading ? (
                        <div className={`border-2 border-gray-400 border-t-transparent rounded-full animate-spin ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                    ) : (
                        <HiDownload className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                    )}
                    {downloading ? 'Downloading…' : 'Download'}
                </button>
            )}
        </div>
    );
}
