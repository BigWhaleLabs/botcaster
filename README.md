# Botcaster

Farcaster bot framework.

## Installation

1. Add Botcaster with `yarn add @big-whale-labs/botcaster`
2. Use the framework in the following way:

```ts
import { startPolling } from 'botcaster'

const farcasterAddress = '0x143979b5E07138b5555001fF34474cFFDf6E97FB'
startPolling(farcasterAddress, (notification) => {
  console.log(notification)
})
```

And you should be good to go! Feel free to fork and submit pull requests.
