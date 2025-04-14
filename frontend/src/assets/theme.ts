import { extendTheme } from "@chakra-ui/react"

const config = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
}

const colors = {
	dark: {
		background: 'hsl(240 5% 6%)',
		foreground: 'hsl(60 5% 90%)',
		primary: 'hsl(240 0% 90%)',
		primary_foreground: 'hsl(60 0% 0%)',
		secondary: 'hsl(240 4% 15%)',
		secondary_foreground: 'hsl(60 5% 85%)',
		accent: 'hsl(240 0% 13%)',
		accent_foreground: 'hsl(60 0% 100%)',
		muted: 'hsl(240 5% 25%)',
		muted_foreground: 'hsl(60 5% 85%)',
		card: 'hsl(240 4% 10%)',
		card_foreground: 'hsl(60 5% 90%)',
		destructive: 'hsl(0 60% 50%)',
		destructive_foreground: 'hsl(0 0% 98%)',
		popover: 'hsl(240 5% 15%)',
		popover_foreground: 'hsl(60 5% 85%)',
		border: 'hsl(240 6% 20%)',
		input: 'hsl(240 6% 20%)',
		ring: 'hsl(240 5% 90%)',
		chart1: 'hsl(359 2% 90%)',
		chart2: 'hsl(240 1% 74%)',
		chart3: 'hsl(240 1% 58%)',
		chart4: 'hsl(240 1% 42%)',
		chart5: 'hsl(240 2% 26%)'
	},
	light: {
		background: "hsl(0, 0%, 100%)",
		foreground: "hsl(240, 10%, 3.9%)",
		primary: "hsl(240, 5.9%, 10%)",
		primaryForeground: "hsl(0, 0%, 98%)",
		secondary: "hsl(240, 4.8%, 95.9%)",
		secondaryForeground: "hsl(240, 5.9%, 10%)",
		accent: "hsl(240, 4.8%, 95.9%)",
		accentForeground: "hsl(240, 5.9%, 10%)",
		muted: "hsl(240, 4.8%, 95.9%)",
		mutedForeground: "hsl(240, 3.8%, 45%)",
		card: "hsl(0, 0%, 100%)",
		cardForeground: "hsl(240, 10%, 3.9%)",
		destructive: "hsl(0, 72%, 51%)",
		destructiveForeground: "hsl(0, 0%, 98%)",
		popover: "hsl(0, 0%, 100%)",
		popoverForeground: "hsl(240, 10%, 3.9%)",
		border: "hsl(240, 5.9%, 90%)",
		input: "hsl(240, 5.9%, 90%)",
		ring: "hsl(240, 5.9%, 10%)",
		chart1: "hsl(173, 58%, 39%)",
		chart2: "hsl(12, 76%, 61%)",
		chart3: "hsl(197, 37%, 24%)",
		chart4: "hsl(43, 74%, 66%)",
		chart5: "hsl(27, 87%, 67%)"
	}
}

const styles = {
	global: {
		"*": {
			fontFamily: "Poppins, sans-serif",
		},
	}
}

export const theme = extendTheme({
	config,
	colors,
	styles,
})