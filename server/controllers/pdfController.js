import pdfParse from 'pdf-parse';

// @desc    Extract text from uploaded PDF
// @route   POST /api/pdf/extract
// @access  Public
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
        // 30,000 characters is a safe limit for a standard request
        if (text.length > 30000) {
            text = text.substring(0, 30000) + '\n\n[...PDF truncated due to length limits]';
        }

        res.status(200).json({
            text,
            pageCount: data.numpages,
            info: data.info
        });
    } catch (error) {
        console.error('PDF extraction error:', error);
        res.status(500).json({ message: 'Failed to extract text from PDF: ' + error.message });
    }
};
