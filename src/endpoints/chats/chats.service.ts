/*
WHERE THE MAGIC HAPPENS

called from chats controller, this will take the chat passed from the controller
and look in the db to find the chat history, then will contact the model endpoint
and pass it the prompt, chat history (or simple context system?) and the most recent
chat by the user, then return the model's response to the controller
*/

//these arent being mapped 1-1 with the repositories

//Nest
import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ServiceUnavailableException
} from "@nestjs/common";

//Repositories
import { SessionsRepository, MessagesRepository } from './repos';
import { PromptsRepository } from "../prompts/prompts.repository";

//utils
import { openAiChat } from "src/lib/models";

@Injectable()
export class ChatsService {
    constructor(
        private readonly sessionsRepository: SessionsRepository, 
        private readonly messagesRepository: MessagesRepository,
        private readonly promptsRepository: PromptsRepository,
    ) {}

    // ============
    // MESSAGES
    // ============

    //find message by id
    findMessageById(message_id: number) {
        if (!message_id || message_id < 1) {
            throw new BadRequestException("Invalid message id");
        }

        return this.messagesRepository.findById(message_id);
    }

    //create message
    createMessage(session_id: number, role: "user" | "assistant", content: string, token_count: number | null = null) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id");
        }

        if (content.length < 1) {
            throw new BadRequestException("Invalid content");
        }

        if (token_count && !Number.isInteger(token_count)) {
            throw new BadRequestException("Invalid token count");
        }

        return this.messagesRepository.create(session_id, role, content, token_count);
    }

    //delete message
    deleteMessage(message_id: number) {
        if (!message_id || message_id < 1) {
            throw new BadRequestException("Invalid message id");
        }

        return this.messagesRepository.delete(message_id);
    }

    //log message in db, send to model, return model's response
    async getModelResponse(session_id: number, content: string) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id");
        }

        //load the session
        const session = await this.sessionsRepository.findById(session_id);

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        //get chat history (last 15)
        const history = await this.messagesRepository.findBySessionId(session_id, 15);

        //get system prompt
        const prompt = await this.promptsRepository.findById(session.prompt_id);
        
        if (!prompt) {
            throw new NotFoundException("Prompt not found");
        }

        //create messages block (send to openai.ts)
        const messages = [
            { role: "system", content: prompt.prompt },
            ...history.map(m => ({
                role: m.role,
                content: m.content,
            })),
            { role: "user", content: content },
        ];

        //send to model
        try {
            //save users message in db
            await this.createMessage(session_id, "user", content);

            const response = await openAiChat(messages);

            //create new response message
            await this.createMessage(
                session_id,
                "assistant",
                response.text,
                response.usage ? response.usage.output_tokens : null,
            );

            return response.text;
        } catch (error) {
            throw new ServiceUnavailableException("Error calling OpenAI API");
        }
    }

    // ============
    // SESSIONS
    // ============

    //find session by id
    findSessionById(session_id: number) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id");
        }

        return this.sessionsRepository.findById(session_id);
    }

    //find sessions by user id
    findSessionsByUserId(user_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException("Invalid user id");
        }

        return this.sessionsRepository.findByUserId(user_id);
    }

    //create session
    createSession(user_id: number, title: string, prompt_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException("Invalid user id");
        }

        if (title.length < 1) {
            throw new BadRequestException("Invalid title");
        }

        return this.sessionsRepository.create(user_id, title, prompt_id);
    }

    //delete session
    deleteSession(session_id: number) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id");
        }

        return this.sessionsRepository.delete(session_id);
    }
}