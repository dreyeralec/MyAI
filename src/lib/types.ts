//types

//session
export type Session = {
    session_id: number
    user_id: number
    title: string
    created_at: string
    updated_at: string
    prompt_id: number
}

//chat message
export type ChatMessage = {
    message_id: number
    session_id: number
    //Open AI uses assistant
    role: string | 'user' | 'assistant' | 'system'
    content: string
    token_count: number | null
    created_at: string
}

//user
export type User = {
    user_id: number
    firebase_uuid: string
    username: string
    email: string
    paid_user: boolean
    created_at: string
}

//prompt
export type Prompt = {
    prompt_id: number
    user_id: number
    created_at: string
    prompt: string
    name: string
}