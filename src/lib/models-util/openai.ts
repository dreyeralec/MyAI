//Open AI (GPT models)

//Open AI
import OpenAI from "openai";

//global client variable
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

//sending chat
export async function openAiChat(messages: any) {
    const response = await client.responses.create({
        model: "gpt-5.4-mini",
        input: messages,
    });

    return {
        text: response.output_text,
        usage: response.usage,
    }
}