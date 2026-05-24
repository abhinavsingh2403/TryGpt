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
    const randomImage = aiImages[Math.floor(Math.random() * aiImages.length)];
    return {
        response: `Here is the image you requested for: "${prompt.replace(/generate|create|make|draw|an image of|a picture of/gi, '').trim()}"\n\n![Generated Image](${randomImage})`,
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
        let promptText = 'You are TryGPT, a helpful AI assistant. Format your answers in markdown. Keep them accurate and helpful.\n\n'
        
        const historyPayload = messageHistory.slice(-10).filter(m => !m.isImage)
        for (const m of historyPayload) {
            promptText += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`
        }
        promptText += `User: ${text}\nAssistant:`

        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptText)}`)

        if (!res.ok) throw new Error('Pollinations API failed')
        const aiText = await res.text()
        
        if (aiText.toLowerCase().includes('limit reached') || aiText.toLowerCase().includes('rate limit') || aiText.toLowerCase().includes('quota')) {
            return { response: "⚠️ **Public API Limit Reached**\n\nThe free public backup servers are currently overloaded. To get unlimited, lightning-fast responses (including Multimodal Vision), please update your **Gemini API Key** in the Settings menu!", isImage: false, delay: 100 }
        }
        
        return { response: aiText, isImage: false, delay: 100 }
    } catch (e) {
        console.error("Local engine text generation failed:", e)
        return { response: "I'm having trouble connecting to the backup AI network right now. Please try again later.", isImage: false, delay: 100 }
    }
}
