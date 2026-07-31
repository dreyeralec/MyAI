//Mantine
import {
	Flex,
} from "@mantine/core";

//Components
import { Sidebar, ChatUI } from "./components";

//React
import { useState } from "react";

export default function Home() {
	const [userid, setUserId] = useState<number>(1);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [displayPrompt, setDisplayPrompt] = useState<string | null>(null);

	return (
		<Flex>
			<Sidebar
				user_id={userid}
				changeSession={setSessionId}
				setDisplayPrompt={setDisplayPrompt}
			/>

			<ChatUI
				session_id={sessionId}
				displayPrompt={displayPrompt}
			/>
		</Flex>
	)
}