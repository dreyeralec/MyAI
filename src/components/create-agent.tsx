// Types
import { Prompt } from "../lib/types"

// Mantine
import {
    Button,
    Stack,
    Modal,
    Group,
    TextInput,
    Textarea,
} from "@mantine/core"

// Notifications
import { Notifications } from "@mantine/notifications"


// React
import { useState } from "react"

// Backend connection
const BASE_URL = 'http://localhost:3000'

export function CreateAgent({ user_id, addPrompt, opened, close }: { user_id: number, addPrompt: (prompt: Prompt) => void, opened: boolean, close: () => void }) {
    const [promptName, setPromptName] = useState<string>("");
    const [promptContent, setPromptContent] = useState<string>("");

    /**
     * Create a new Agent
     * 
     * @param name - Name of the Agent
     * @param prompt - Content for the context prompt
     */
    const createAgent = async (name: string, prompt: string) => {
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
                        onClick={() => createAgent(promptName, promptContent)}
                    >
                        Create
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}