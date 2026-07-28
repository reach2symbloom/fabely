import * as React from 'react'
import { addons, types, useGlobals } from 'storybook/manager-api'
import { create, themes } from 'storybook/theming'
import { IconButton } from 'storybook/internal/components'
import { SunIcon, MoonIcon } from '@storybook/icons'

// A single-click theme button, not the globalTypes toolbar dropdown (which
// always requires opening a menu). Same pattern Storybook's own built-in
// Outline/Measure/Grid toolbar buttons use: a custom `tool` addon that flips
// the global directly via useGlobals()/updateGlobals.
const TOOL_ID = 'fabely-theme-toggle'

// Must match the key preview.tsx reads/writes so the manager chrome and the
// story preview boot into the same theme on a fresh load.
const THEME_STORAGE_KEY = 'fabely-storybook-theme'
type ThemeName = 'light' | 'dark'

function getStoredTheme(): ThemeName {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

// Swaps Storybook's default logo/wordmark for the Fabely lockup, picking the
// asset drawn for the surface it'll sit on (pale wordmark on the dark manager
// chrome, ink wordmark on the light one). Colors/spacing otherwise come
// straight from Storybook's own light/dark presets, so only branding changes.
function brandTheme(theme: ThemeName) {
  return create({
    ...(theme === 'dark' ? themes.dark : themes.light),
    brandTitle: 'Fabely',
    brandImage: theme === 'dark' ? '/logo-dark.png' : '/logo-light.png',
    brandTarget: '_self',
  })
}

addons.setConfig({ theme: brandTheme(getStoredTheme()) })

addons.register(TOOL_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => {
      const [globals, updateGlobals] = useGlobals()
      const theme: ThemeName = globals.theme === 'dark' ? 'dark' : 'light'

      const toggle = () => {
        const next: ThemeName = theme === 'dark' ? 'light' : 'dark'
        updateGlobals({ theme: next })
        addons.setConfig({ theme: brandTheme(next) })
      }

      return (
        <IconButton
          key={TOOL_ID}
          title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
          onClick={toggle}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      )
    },
  })
})
