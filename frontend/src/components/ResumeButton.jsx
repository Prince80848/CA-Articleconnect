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
    if (!resumeUrl) return null;

    const viewerUrl = getViewerUrl(resumeUrl);
    const btnBase = compact
        ? 'flex items-center gap-1 text-xs font-medium border rounded-lg px-2 py-1 transition-colors'
        : 'flex items-center gap-1.5 text-sm font-medium border rounded-lg px-3 py-1.5 transition-colors';

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
                <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download Resume"
                    className={`${btnBase} text-gray-600 border-gray-200 hover:bg-gray-50`}
                >
                    <HiDownload className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                    Download
                </a>
            )}
        </div>
    );
}
