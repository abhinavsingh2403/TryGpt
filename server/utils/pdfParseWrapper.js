// Lazy-loaded pdf-parse to avoid Vercel serverless boot crash.
// pdf-parse v2 tries to read a test file on import which kills cold starts.
let _pdfParse = null;

export async function parsePdf(buffer) {
    if (!_pdfParse) {
        _pdfParse = (await import('pdf-parse')).default;
    }
    return _pdfParse(buffer);
}
