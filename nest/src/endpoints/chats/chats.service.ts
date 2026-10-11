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

    /**
     * Calls repository to find a message by the message id
     * 
     * @param message_id - message id of message
     * @throws {BadRequestException}
     * @returns message object found
    */
    findMessageById(message_id: number) {
        if (!message_id || message_id < 1) {
            throw new BadRequestException("Invalid message id");
        }

        return this.messagesRepository.findById(message_id);
    }

    /**
     * Calls repository to create a message
     * 
     * @param session_id - session the message belongs to
     * @param role - who produced the message
     * @param content - content of message
     * @param token_count - amount of tokens used, recieved from API call
     * @throws {BadRequestException}
     * @returns message object created
    */
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

    /**
     * Calls repository to delete a message
     * 
     * @param message_id - message id of message to be deleted
     * @throws {BadRequestException}
     * @returns message object deleted
    */
    deleteMessage(message_id: number) {
        if (!message_id || message_id < 1) {
            throw new BadRequestException("Invalid message id");
        }

        return this.messagesRepository.delete(message_id);
    }

    /**
     * Gets messages belonging to session id,
     * reverses the array so newest sessions are first
     * 
     * @param session_id - session the messages belong to
     * @param take - amount of messages to be returned
     * @throws {BadRequestException}
     * @returns message objects in session
    */
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

    /**
     * Send the message to the model,
     * create message object in the database,
     * update the updated_at field for the session
     * 
     * @param session_id - session the message belongs to
     * @param content - content for the message
     * @throws {BadRequestException, NotFoundException, ServiceUnavailableException}
     * @returns message object of the models response
    */
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

    /**
     * Calls repository find a session by its id
     * 
     * @param session_id - session id of session being searched for
     * @throws {BadRequestException}
     * @returns session object that was found
    */
    findSessionById(session_id: number) {
        if (!session_id || session_id < 1) {
            throw new BadRequestException("Invalid session id");
        }

        return this.sessionsRepository.findById(session_id);
    }

    /**
     * Calls repository to find sessions by a user
     * 
     * @param user_id - user the sessions belong to
     * @throws {BadRequestException}
     * @returns sessions belonging to user
    */
    findSessionsByUserId(user_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException("Invalid user id");
        }

        return this.sessionsRepository.findByUserId(user_id);
    }

    /**
     * Calls repository to find sessions using provided prompt id
     * 
     * @param prompt_id - prompt the sessions belong to
     * @throws {BadRequestException}
     * @returns sessions belonging to prompt
    */
    findSessionsByPromptId(prompt_id: number) {
        if (!prompt_id || prompt_id < 1) {
            throw new BadRequestException("Invalid prompt id");
        }

        return this.sessionsRepository.findByPromptId(prompt_id)
    }

    /**
     * Calls repository to create a session
     * 
     * @param user_id - user the session belongs to
     * @param title - title of session
     * @param prompt - prompt the session is using
     * @throws {BadRequestException}
     * @returns sessions belonging to user
    */
    createSession(user_id: number, title: string, prompt_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException("Invalid user id");
        }

        if (title.length < 1) {
            throw new BadRequestException("Invalid title");
        }

        return this.sessionsRepository.create(user_id, title, prompt_id);
    }

    /**
     * Calls repository to delete a session,
     * validates session belongs to user,
     * deletes all messages in the session
     * 
     * @param session_id - session that is being deleted
     * @param user_id - user the session belongs to
     * @throws {BadRequestException, NotFoundException, ForbiddenException}
     * @returns session object that was deleted
    */
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