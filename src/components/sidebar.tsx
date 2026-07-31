// Types
import { Prompt, Session } from "../lib/types"

// Mantine
import {
    Button,
    Paper,
    Text,
    Stack,
    ScrollArea,
} from "@mantine/core"

// Notifications
import { Notifications } from "@mantine/notifications"

// Hooks
import { useDisclosure } from "@mantine/hooks"

// React
import { useState } from "react"

// Components
import { SessionSelect, CreateAgent } from './index'

// Backend connection
const BASE_URL = 'http://localhost:3000'

export function Sidebar({
    prompts, // prompts fetched from database
    user_id, // user thats logged in
    addPrompt, // add prompt to database
    changeSession, // change session function
    selectedPrompt, // parent prompt state
    setSelectedPrompt, // change parent prompt state
    setDisplayPrompt, // name of selected prompt to display
    refreshPrompts, // fetch new prompts for ui
    createSession, // create new session
}: {
    prompts: Prompt[],
    user_id: number,
    addPrompt: (prompt: Prompt) => void,
    changeSession: (session_id: number) => void
    selectedPrompt: Prompt | null
    setSelectedPrompt: (prompt: Prompt | null) => void
    setDisplayPrompt: (name: string | null) => void
    refreshPrompts: (user_id: number) => void,
    createSession: (user_id: number, title: string, prompt_id: number) => Promise<Session | null>
}) {
    // States
    const [sessions, setSessions] = useState<Session[]>([]); //holds sessions for prompt

    // Modals
    const [createPromptOpen, { open: openCreatePrompt, close: closeCreatePrompt }] = useDisclosure(false);
    const [selectSessionOpen, { open: openSelectSession, close: closeSelectSession }] = useDisclosure(false);

    /**
     * Get existing sessions
     * 
     * @param prompt_id - Query all sessions for this prompt
     */
    const getSessions = async (prompt_id: number) => {
        try {
            const res = await fetch(`${BASE_URL}/chats/session/prompt/${prompt_id}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error("Couldn't find sessions");
            }

            setSessions(data);
        } catch (err) {
            Notifications.show({
                title: "Couldn't Find Sessions",
                message: `${err || "Something went wrong"}`,
                color: "red"
            });
        }
    }

    return (
        <>
            <Stack gap="sm" p="md" h="100%" w="20%">
                <Button
                    variant="filled"
                    color="blue"
                    radius="md"
                    fullWidth
                    onClick={openCreatePrompt}
                >
                    + Create Agent
                </Button>

                <ScrollArea h="86vh">
                    <Stack gap="xs">
                        {prompts?.map((p) => (
                            <Paper
                                key={p.prompt_id}
                                p="sm"
                                radius="md"
                                bg="white"
                                withBorder
                                shadow="xs"
                                className="cursor-pointer"
                                style={{ borderColor: "var(--mantine-color-blue-2)" }}
                                onClick={() => {
                                    setSelectedPrompt(p);
                                    getSessions(p.prompt_id);
                                    openSelectSession();
                                }}
                            >
                                <Text
                                    fw={600}
                                    c="blue.7"
                                    size="sm"
                                >
                                    {p.name}
                                </Text>

                                <Text c="dimmed" size="xs" mt={2}>
                                    {p.prompt.slice(0, 20)}{p.prompt.length > 20 && "..."}
                                </Text>
                            </Paper>
                        ))}
                    </Stack>
                </ScrollArea>
            </Stack>

            <CreateAgent
                user_id={user_id}
                addPrompt={addPrompt}
                opened={createPromptOpen}
                close={closeCreatePrompt}
            />

            <SessionSelect
                sessions={sessions}
                user_id={user_id}
                selectedPrompt={selectedPrompt}
                setDisplayPrompt={setDisplayPrompt}
                refreshPrompts={refreshPrompts}
                refreshSessions={getSessions}
                createSession={createSession}
                changeSession={changeSession}
                opened={selectSessionOpen}
                close={closeSelectSession}
            />
        </>
    )
}