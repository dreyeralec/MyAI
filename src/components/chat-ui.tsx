//chat component

"use client";

//Mantine
import {
    Flex,
    ScrollArea,
    Paper,
    Text,
    Textarea,
    Button,
    Center,
} from "@mantine/core";

//Notifications
import {
    Notifications
} from "@mantine/notifications";

//React
import { useState, useEffect, useCallback } from "react";

//Types
import { CleanedChat } from "../lib/types";

export function ChatUI({
    baseUrl, //base url for backend routes
    session_id, //session being displayed
    displayPrompt //name of prompt for UI
}: {
    baseUrl: string
    session_id: number | null
    displayPrompt: string | null
}) {
    const [userChat, setUserChat] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<CleanedChat[]>([]);

    /**
     * Send chat to the model and handle the response
     * 
     * @param session_id - Session the chat belongs to
     * @param content - Content of the chat
     */
    const sendChat = useCallback(async (session_id: number, content: string) => {
        setUserChat("");

        //add the user's chat to the chat history
        setChatHistory(prev => [...prev, {
            message_id: crypto.randomUUID(), //need a random id for the .map() function
            content: content,
            role: "user"
        }]);

        try {
            //send the user's chat to the model
            const res = await fetch(`${baseUrl}/chats/model`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: session_id,
                    content: content,
                }),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const data = await res.json();

            //add the response from the model to the chat history
            setChatHistory(prev => [...prev, {
                message_id: crypto.randomUUID(),
                content: data.content,
                role: "assistant",
            }]);
        } catch (err) {
            Notifications.show({
                title: "Couldn't Send Chat",
                message: `${err || "Something went wrong"}`,
                color: "red",
            });

            //generic error message to display to user
            setChatHistory(prev => [...prev, {
                message_id: crypto.randomUUID(),
                content: "⚠️ There was an error, try again?",
                role: "assistant",
            }]);
        }
    }, [session_id]);

    /**
     * Get the previous chats from a session
     * 
     * @param session_id - Session the messages are in
     * @param take - Optional to specify the amount of messages you want
     */
    const getChatHistory = useCallback(async (session_id: number, take: number) => {
        try {
            // Use search params for GET request
            const url = new URL(`${baseUrl}/chats/messages`);
            url.searchParams.set('session_id', String(session_id));
            url.searchParams.set('take', String(take));

            const history = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!history.ok) {
                throw new Error(history.statusText);
            }

            const data = await history.json();
            const cleanedHistory = data.map((h: CleanedChat) => ({
                message_id: crypto.randomUUID(),
                content: h.content,
                role: h.role,
            }));

            setChatHistory(cleanedHistory);
        } catch (err) {
            Notifications.show({
                title: "Chat History Wasn't Found",
                message: `${err || "Something went wrong"}`,
                color: "red",
            });
        }
    }, [session_id]);

    useEffect(() => {
        if (!session_id) return
        getChatHistory(session_id, 15);
    }, [session_id]);

    return (
        <Flex direction="column" w="100%" align="center" h="100vh" bg="gray.0">
            <Paper
                w="100%"
                py="sm"
                px="xl"
                radius={0}
                withBorder
                style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}
            >
                <Flex align="center" justify="center">
                    <Paper
                        bg="blue.6"
                        w="fit-content"
                        px="md"
                        py={4}
                        radius="md"
                    >
                        <Text c="white" fw={600} size="sm">
                            {displayPrompt || "Agent"}
                        </Text>
                    </Paper>
                </Flex>
            </Paper>

            <ScrollArea h="87vh" w="100%" px="xl">
                <Flex direction="column" w="100%" maw="800px" mx="auto">
                    {chatHistory.length > 0 ? chatHistory.map((chat) => {
                        if (chat.role === "user") {
                            return (
                                <Paper
                                    key={chat.message_id}
                                    p="md"
                                    w="fit-content"
                                    maw="45%"
                                    bg="blue.6"
                                    ml="auto"
                                    radius="lg"
                                    my="sm"
                                    shadow="xs"
                                >
                                    <Text c="white" fw={600} size="xs" mb={2}>
                                        You
                                    </Text>
                                    <Text c="white">{chat.content}</Text>
                                </Paper>
                            )
                        } else {
                            return (
                                <Paper
                                    key={chat.message_id}
                                    p="md"
                                    w="fit-content"
                                    maw="45%"
                                    bg="white"
                                    mr="auto"
                                    radius="lg"
                                    my="sm"
                                    shadow="xs"
                                    withBorder
                                    style={{ borderColor: "var(--mantine-color-blue-2)" }}
                                >
                                    <Text c="blue.7" fw={600} size="xs" mb={2}>
                                        {displayPrompt || "Agent"}
                                    </Text>
                                    <Text c="dark">{chat.content}</Text>
                                </Paper>
                            )
                        }
                    }) : <Center mt="xl"><Text c="grey" >Choose an Agent to start chatting</Text></Center>}
                </Flex>
            </ScrollArea>

            <Paper
                w="100%"
                py="md"
                radius={0}
                bg="gray.0"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                }}>
                <Textarea
                    radius="lg"
                    p="sm"
                    size="md"
                    w="50%"
                    placeholder="Type your response..."
                    value={userChat}
                    minRows={1}
                    maxRows={3}
                    autosize
                    onChange={(event) => setUserChat(event.target.value)}
                />

                <Button
                    mt="sm"
                    p="sm"
                    size="sm"
                    color="blue"
                    radius="md"
                    variant={`${!userChat.trim() ? "outline" : "filled"}`}
                    onClick={() => {
                        //needs error handling
                        if (!session_id) {
                            return
                        }

                        sendChat(session_id, userChat);
                    }}
                >
                    ➤
                </Button>
            </Paper>
        </Flex>
    )
}