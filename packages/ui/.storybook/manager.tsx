import * as React from 'react'
import { addons, types, useGlobals } from 'storybook/manager-api'
import { IconButton } from 'storybook/internal/components'
import { SunIcon, MoonIcon } from '@storybook/icons'

// A single-click theme button, not the globalTypes toolbar dropdown (which
// always requires opening a menu). Same pattern Storybook's own built-in
// Outline/Measure/Grid toolbar buttons use: a custom `tool` addon that flips
// the global directly via useGlobals()/updateGlobals.
const TOOL_ID = 'fabely-theme-toggle'

addons.register(TOOL_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => {
      const [globals, updateGlobals] = useGlobals()
      const theme = globals.theme === 'dark' ? 'dark' : 'light'

      return (
        <IconButton
          key={TOOL_ID}
          title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
          onClick={() => updateGlobals({ theme: theme === 'dark' ? 'light' : 'dark' })}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      )
    },
  })
})
