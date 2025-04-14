import { StrictMode } from 'react'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { theme } from "./assets/theme"
import { router } from './routes/Router'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<RouterProvider router={router} />
		</ChakraProvider>
	</StrictMode>,
)
