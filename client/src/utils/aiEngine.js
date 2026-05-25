function generateImageResponse(prompt) {
    const cleanPrompt = prompt.replace(/generate|create|make|draw|an image of|a picture of/gi, '').trim() || 'beautiful scenery'
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`

    return {
        response: imageUrl,
        prompt: cleanPrompt,
        isImage: true,
    }
}

export async function generateAIResponse(text) {
    const lower = text.toLowerCase()

    const isImageRequest = (
        (lower.includes('generate') || lower.includes('create') || lower.includes('make') || lower.includes('draw')) &&
        (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('art'))
    )

    if (isImageRequest) {
        const imgRes = generateImageResponse(text)
        return {
            response: imgRes.response,
            prompt: imgRes.prompt,
            isImage: true,
            delay: 100,
        }
    }

    return {
        response: "Warning: Gemini request failed or the server API key is missing. Please check the Gemini API key in the server environment, confirm quota is available, and try again.",
        isImage: false,
        delay: 100,
    }
}
