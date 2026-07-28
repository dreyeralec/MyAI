// Nest
import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ServiceUnavailableException,
    ForbiddenException
} from "@nestjs/common";

// Repositories
import { SessionsRepository, MessagesRepository } from './repos';
import { PromptsRepository } from "../prompts/prompts.repository";

// Utils
import { openAiChat } from "src/lib/models";

// Type
type Message = {
    message_id: number;
    session_id: number | null;
    role: string;
    content: string;
    token_count: number | null;
    created_at: Date | null;
}

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

    //get messages by session id, these come in as strings because
    //they are search parameters
    //then reverse the array ()
    async findBySessionId(session_id: string, take: string) {
        if (!session_id || Number(session_id) < 1 || isNaN(Number(session_id))) {
            throw new BadRequestException(`Invalid session id findBySessionID; session id: ${session_id}; type: ${typeof(session_id)}`);
        }

        if (!take || Number(take) < 1 || isNaN(Number(take))) {
            throw new BadRequestException(`Invalid take findBySessionID; take: ${take}; type: ${typeof(take)}`);
        }

        const messages = await this.messagesRepository.findBySessionId(Number(session_id), Number(take));

        let orderedMessages: Message[] = []

        messages.forEach((m) => {
            orderedMessages.unshift(m)
        })

        return orderedMessages
    }

    //log message in db, send to model, return model's response
    async getModelResponse(session_id: number, content: string) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id getModelResponse");
        }

        //load the session
        const session = await this.findSessionById(session_id);

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        //get chat history (last 15)
        const history = await this.findBySessionId(String(session_id), String(15));

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
            const assistant_response = await this.createMessage(
                session_id,
                "assistant",
                response.text,
                response.usage ? response.usage.output_tokens : null,
            );

            //update the updated at field for the session
            this.sessionsRepository.updateTimestamp(session_id);

            return assistant_response;
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

    //find sessions by prompt id
    findSessionsByPromptId(prompt_id: number) {
        if (!prompt_id || prompt_id < 1) {
            throw new BadRequestException("Invalid prompt id");
        }

        return this.sessionsRepository.findByPromptId(prompt_id)
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
    async deleteSession(session_id: number, user_id: number) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id");
        }

        if (!user_id || user_id < 1) {
            throw new BadRequestException("Invalid user id");
        }

        const session = await this.sessionsRepository.findById(session_id);

        if (!session) {
            throw new NotFoundException("Session not found");
        }
        
        if (session.user_id !== user_id) {
            throw new ForbiddenException("User does not own this session");
        }

        const messages = await this.messagesRepository.findBySessionId(session_id);

        await Promise.all(
            messages.map((m) => this.messagesRepository.delete(m.message_id))
        );

        return this.sessionsRepository.delete(session_id);
    }
}