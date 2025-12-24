import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'

addons.setConfig({
  panelPosition: 'bottom',
  theme: themes.dark,
})

