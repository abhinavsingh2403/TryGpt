import ai_image1 from '../assets/ai_image1.jpg'
import ai_image2 from '../assets/ai_image2.jpg'
import ai_image3 from '../assets/ai_image3.jpg'
import ai_image4 from '../assets/ai_image4.jpg'
import ai_image5 from '../assets/ai_image5.jpg'
import ai_image6 from '../assets/ai_image6.jpg'
import ai_image7 from '../assets/ai_image7.jpg'
import ai_image8 from '../assets/ai_image8.jpg'
import ai_image9 from '../assets/ai_image9.jpg'
import ai_image10 from '../assets/ai_image10.jpg'
import ai_image11 from '../assets/ai_image11.jpg'
import ai_image12 from '../assets/ai_image12.jpg'

const aiImages = [ai_image1, ai_image2, ai_image3, ai_image4, ai_image5, ai_image6, ai_image7, ai_image8, ai_image9, ai_image10, ai_image11, ai_image12]

function generateImageResponse(prompt) {
    const cleanPrompt = prompt.replace(/generate|create|make|draw|an image of|a picture of/gi, '').trim() || 'beautiful scenery';
    // Use Pollinations AI for instant, real image generation via URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    return {
        response: `Here is the image you requested for: "${cleanPrompt}"\n\n![Generated Image](${imageUrl})`,
        isImage: true
    };
}

export async function generateAIResponse(text, messageHistory = []) {
    const lower = text.toLowerCase()
    
    // Check if image request
    const isImageRequest = (
        (lower.includes('generate') || lower.includes('create') || lower.includes('make') || lower.includes('draw')) &&
        (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('art'))
    )

    if (isImageRequest) {
        const imgRes = generateImageResponse(text)
        return {
            response: imgRes.response,
            isImage: true,
            delay: 100
        }
    }

    try {
        return { response: "⚠️ **Gemini API Error / Missing Key**\n\nThe AI request failed. Please check your **Gemini API Key** in the settings, or ensure you haven't exceeded your rate limits. The local backup text engine has been deprecated.", isImage: false, delay: 100 }
    } catch (e) {
        console.error("Local engine text generation failed:", e)
        return { response: "I'm having trouble connecting to the AI network right now. Please try again later.", isImage: false, delay: 100 }
    }
}
