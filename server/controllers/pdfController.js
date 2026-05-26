import pdfParse from 'pdf-parse';

// @desc    Extract text from uploaded PDF, chunk it, and generate embeddings
// @route   POST /api/pdf/extract
// @access  Public

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function chunkText(text, maxWords = 400, overlap = 50) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += (maxWords - overlap)) {
        const chunk = words.slice(i, i + maxWords).join(' ');
        if (chunk.trim().length > 0) {
            chunks.push(chunk);
        }
    }
    return chunks;
}

async function getEmbeddings(chunks, apiKey) {
    // We can embed up to 100 chunks at once in a batch if we use batch requests,
    // but a simple Promise.all is easier for Gemini since it's fast.
    const promises = chunks.map(async (chunk) => {
        const res = await fetch(`${GEMINI_API_BASE}/models/text-embedding-004:embedContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/text-embedding-004',
                content: { parts: [{ text: chunk }] }
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Embedding failed');
        return { text: chunk, embedding: data.embedding.values };
    });
    return Promise.all(promises);
}
export const extractPdfText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' });
        }

        const dataBuffer = req.file.buffer;
        
        // Parse the PDF buffer
        const data = await pdfParse(dataBuffer);
        
        // Extract text and clean it up slightly
        let text = data.text.trim();
        
        // Cap the text to avoid sending massive payloads to Gemini
        // We'll limit to roughly 15,000 words (which is about 50 pages)
        if (text.length > 80000) {
            text = text.substring(0, 80000) + '\n\n[...PDF truncated due to length limits]';
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server');

        const chunks = chunkText(text);
        
        // Cap chunks to max 20 to avoid rate limits on free tier during resume review
        const limitedChunks = chunks.slice(0, 20); 

        const documents = await getEmbeddings(limitedChunks, apiKey);

        res.status(200).json({
            documents,
            pageCount: data.numpages,
            info: data.info
        });
    } catch (error) {
        console.error('PDF extraction error:', error);
        res.status(500).json({ message: 'Failed to process PDF: ' + error.message });
    }
};
