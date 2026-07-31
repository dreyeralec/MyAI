// Types
import { Prompt, Session } from "../lib/types"

// Mantine
import {
    Button,
    Paper,
    Text,
    Stack,
    Modal,
    Flex,
    ScrollArea,
    Group,
} from "@mantine/core"

//Notifications
import { Notifications } from "@mantine/notifications"

// Backend connection
const BASE_URL = 'http://localhost:3000'

export function SessionSelect({
    sessions,
    user_id,
    selectedPrompt,
    setDisplayPrompt,
    refreshPrompts,
    refreshSessions,
    createSession,
    changeSession,
    opened,
    close
}: {
    sessions: Session[]
    user_id: number
    selectedPrompt: Prompt | null
    setDisplayPrompt: (name: string | null) => void
    refreshPrompts: (user_id: number) => void
    refreshSessions: (prompt_id: number) => void
    createSession: (
        user_id: number,
        title: string,
        prompt_id: number
    ) => Promise<Session | null>
    changeSession: (session_id: number) => void
    opened: boolean
    close: () => void
}) {
    /**
     * Delete the selected Agent
     */
    const deleteAgent = async () => {
        try {
            const res = await fetch(`${BASE_URL}/prompts/${selectedPrompt?.prompt_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt_id: selectedPrompt?.prompt_id,
                    user_id: user_id,
                }),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            }
        } catch (err) {
            Notifications.show({
                title: "Couldn't Delete Agent",
                message: `${err || "Something went wrong"} - Try deleting chat history`,
                color: "red",
            });
        } finally {
            refreshPrompts(user_id);
            close();
        }
    }

    /**
     * Delete selected session
     * 
     * @param session_id - The selected session to be deleted
     */
    const deleteSession = async (session_id: number) => {
        try {
            const res = await fetch(`${BASE_URL}/chats/${session_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: session_id,
                    user_id: user_id,
                }),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            }
        } catch (err) {
            Notifications.show({
                title: "Couldn't Forget Chat",
                message: `${err || "Something went wrong"}`,
                color: "red",
            });
        } finally {
            if (selectedPrompt) refreshSessions(selectedPrompt.prompt_id);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={close}
            title={selectedPrompt?.name}
            radius="md"
            centered
        >
            <Flex direction="column" gap="md">
                <Text c="dimmed" size="sm">
                    {selectedPrompt?.prompt}
                </Text>

                <Button
                    variant="filled"
                    color="blue"
                    radius="md"
                    fullWidth
                    onClick={async () => {
                        try {
                            if (!selectedPrompt) throw new Error("Couldn't find agent")

                            const session = await createSession(user_id, selectedPrompt.name, selectedPrompt.prompt_id);

                            if (!session) throw new Error("Couldn't find session");

                            changeSession(session.session_id);
                            setDisplayPrompt(selectedPrompt.name);
                        } catch (err) {
                            Notifications.show({
                                title: "Couldn't Open Session",
                                message: `${err || "Something went wrong"}`,
                                color: "red"
                            });
                        } finally {
                            close();
                        }
                    }}
                >
                    + Start new chat with {selectedPrompt?.name || "Agent"}
                </Button>

                <Text size="xs" fw={600} c="blue.7" tt="uppercase" mt="xs">
                    Previous chats
                </Text>

                <ScrollArea mb="md" h="">
                    <Stack gap="xs">
                        {sessions.length === 0 && (
                            <Text c="dimmed" size="sm" ta="center" py="md">
                                No previous chats yet
                            </Text>
                        )}

                        {sessions.map((s) => (
                            <Paper
                                key={s.session_id}
                                p="sm"
                                radius="md"
                                withBorder
                                style={{
                                    borderColor: "var(--mantine-color-blue-2)",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    changeSession(s.session_id);
                                    if (selectedPrompt) setDisplayPrompt(selectedPrompt.name);
                                    close();
                                }}
                            >
                                <Flex justify="space-between" align="center">
                                    <Stack gap={2}>
                                        <Text fw={600} c="blue.7" size="sm">
                                            {s.title}
                                        </Text>

                                        <Text size="xs" c="dimmed">
                                            Created: {new Date(s.created_at).toLocaleString()}
                                        </Text>

                                        <Text size="xs" c="dimmed">
                                            Last chat: {new Date(s.updated_at).toLocaleString()}
                                        </Text>
                                    </Stack>

                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSession(s.session_id);
                                        }}
                                    >
                                        Forget chat
                                    </Button>
                                </Flex>
                            </Paper>
                        ))}
                    </Stack>
                </ScrollArea>
            </Flex>
            <Group justify="flex-end">
                <Button
                    radius="md"
                    variant="filled"
                    color="red"
                    onClick={() => deleteAgent()}
                >
                    Delete Agent
                </Button>
            </Group>
        </Modal>
    )
}