//sidebar component

//Types
import { Prompt, Session } from "../lib/types";

//Mantine
import {
    Button,
    Paper,
    Text,
    Stack,
    Modal,
    Flex,
    ScrollArea,
    Group,
    TextInput,
    Textarea,
} from "@mantine/core";

//Notifications
import {
    Notifications,
} from "@mantine/notifications";

//Hooks
import { useDisclosure } from "@mantine/hooks";

//React
import { useState } from "react";

//Backend connection
const BASE_URL = 'http://localhost:3000';

//Sidebar
export function Sidebar({
    prompts, //prompts fetched from database
    user_id, //user thats logged in
    addPrompt, //add prompt to database
    changeSession, //change session function
    selectedPrompt, //parent prompt state
    setSelectedPrompt, //change parent prompt state
    setDisplayPrompt, //name of selected prompt to display
    refreshPrompts, //fetch new prompts for ui
    createSession, //create new session
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
    //states
    const [sessions, setSessions] = useState<Session[]>([]); //holds sessions for prompt

    //modals
    const [createPromptOpen, { open: openCreatePrompt, close: closeCreatePrompt }] = useDisclosure(false);
    const [selectSessionOpen, { open: openSelectSession, close: closeSelectSession }] = useDisclosure(false);

    //get all sessions from prompt
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

            <CreatePrompt
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

//Create prompt modal
function CreatePrompt({ user_id, addPrompt, opened, close }: { user_id: number, addPrompt: (prompt: Prompt) => void, opened: boolean, close: () => void }) {
    const [promptName, setPromptName] = useState<string>("");
    const [promptContent, setPromptContent] = useState<string>("");

    //function to create prompt (working)
    const createPrompt = async (name: string, prompt: string) => {
        try {
            if (prompt.length < 5) {
                throw new Error("Agent description not long enough");
            }

            const res = await fetch(`${BASE_URL}/prompts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user_id,
                    name: name,
                    prompt: prompt,
                }),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const newPrompt = await res.json();

            addPrompt(newPrompt);
        } catch (err) {
            Notifications.show({
                title: "Couldn't Save Prompt",
                message: `${err || "Something went wrong"}`,
                color: "red",
            });
        } finally {
            setPromptContent("");
            setPromptName("");
            close();
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={() => {
                setPromptName("");
                setPromptContent("");
                close();
            }}
            title="Create Agent"
            radius="md"
            centered
        >
            <Stack gap="md">
                <TextInput
                    label="Name"
                    value={promptName}
                    onChange={(event) => setPromptName(event.target.value)}
                    placeholder="Name your agent..."
                    radius="md"
                />

                <Textarea
                    label="Description"
                    value={promptContent}
                    onChange={(event) => setPromptContent(event.target.value)}
                    placeholder="Describe your agent..."
                    minRows={3}
                    maxRows={6}
                    radius="md"
                    autosize
                />

                <Group justify="flex-end">
                    <Button
                        variant="filled"
                        color="blue"
                        radius="md"
                        onClick={() => createPrompt(promptName, promptContent)}
                    >
                        Save
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}

//Session selection modal
function SessionSelect({
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
    const deletePrompt = async () => {
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
                    onClick={() => deletePrompt()}
                >
                    Delete Agent
                </Button>
            </Group>
        </Modal>
    )
}