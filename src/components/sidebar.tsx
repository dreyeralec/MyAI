// Types
import { Prompt, Session } from "../lib/types";

// Notifications
import { Notifications } from "@mantine/notifications";

// Hooks
import { useDisclosure } from "@mantine/hooks";

// React
import { useState, useEffect } from "react";

// Components
import { SessionSelect, CreateAgent } from './index';

// Config
import { API_URL } from "../config";

// Mantine
import {
    Button,
    Paper,
    Text,
    Stack,
    ScrollArea,
} from "@mantine/core";

interface SidebarProps {
    user_id: number;
    changeSession: (session_id: number) => void;
    setDisplayPrompt: (name: string | null) => void;
}

export function Sidebar({
    user_id,
    changeSession,
    setDisplayPrompt,
}: SidebarProps) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [createPromptOpen, { open: openCreatePrompt, close: closeCreatePrompt }] = useDisclosure(false);
    const [selectSessionOpen, { open: openSelectSession, close: closeSelectSession }] = useDisclosure(false);

    /**
     * Append another prompt object to the array of prompts
     * 
     * @param prompt - Prompt to be added
     */
    const addPrompt = async (prompt: Prompt) => {
        setPrompts(prev => [...prev, prompt]);
    }

    /**
     * Get all prompts by user
     * 
     * @param user_id - User to search prompts for
     */
    const loadPrompts = async (user_id: number) => {
        try {
            const res = await fetch(`${API_URL}/prompts/user/${user_id}`);

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const data = await res.json();

            setPrompts(data);
        } catch (err) {
            Notifications.show({
                title: "Couldn't Find Agents",
                message: `${err || "Something went wrong"}`,
                color: "red"
            });
        }
    }

    /**
     * Get existing sessions
     * 
     * @param prompt_id - Query all sessions for this prompt
     */
    const loadSessions = async (prompt_id: number) => {
        try {
            const res = await fetch(`${API_URL}/chats/session/prompt/${prompt_id}`);
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

    useEffect(() => {
        loadPrompts(user_id);
    }, [user_id]);

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
                                    loadSessions(p.prompt_id);
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
                refreshPrompts={loadPrompts}
                refreshSessions={loadSessions}
                changeSession={changeSession}
                opened={selectSessionOpen}
                close={closeSelectSession}
            />
        </>
    )
}