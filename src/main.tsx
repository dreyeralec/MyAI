import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import App from './App.js'
import { Notifications } from '@mantine/notifications'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<MantineProvider>
			<Notifications position="bottom-right" />
			<App />
		</MantineProvider>
	</StrictMode>
)
