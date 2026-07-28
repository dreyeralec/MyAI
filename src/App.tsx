//frontend for chat interface

//Mantine
import {
	Flex,
} from "@mantine/core";

//Notifications
import {
	Notifications
} from "@mantine/notifications";

//Components
import { Sidebar, ChatUI } from "./components";

//React
import { useState, useEffect } from "react";

//Types
import { Prompt, Session } from "./lib/types";

const BASE_URL = 'http://localhost:3000';

export default function Home() {
	//states
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [userid, setUserId] = useState<number>(1);
	const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [displayPrompt, setDisplayPrompt] = useState<string | null>(null); //element for displaying prompt name

	//add prompt
	const addPrompt = async (prompt: Prompt) => {
		setPrompts(prev => [...prev, prompt]);
	}

	//get all prompts by user
	const getPrompts = async (user_id: number) => {
		try {
			const res = await fetch(`${BASE_URL}/prompts/user/${user_id}`);

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

	const createSession = async (user_id: number, title: string, prompt_id: number) => {
		try {
			const res = await fetch(`${BASE_URL}/chats/session`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: user_id,
					title: title,
					prompt_id: prompt_id,
				}),
			});

			const data: Session = await res.json();
			return data;
		} catch {
			Notifications.show({
				title: "Couldn't Create Session",
				message: "Something went wrong",
				color: "red"
			});
			return null;
		}
	}

	useEffect(() => {
		getPrompts(userid);
	}, []);

	return (
		<Flex>
			<Sidebar
				prompts={prompts}
				user_id={userid}
				addPrompt={addPrompt}
				changeSession={setSessionId}
				selectedPrompt={selectedPrompt}
				setSelectedPrompt={setSelectedPrompt}
				setDisplayPrompt={setDisplayPrompt}
				refreshPrompts={getPrompts}
				createSession={createSession}
			/>
			<ChatUI
				baseUrl={BASE_URL}
				session_id={sessionId}
				displayPrompt={displayPrompt}
			/>
		</Flex>
	)
}