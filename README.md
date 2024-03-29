# Botcaster

Farcaster bot framework.

## Installation

1. Add Botcaster with `yarn add @big-whale-labs/botcaster`
2. Use the framework in the following way:

```ts
import { startPolling } from '@big-whale-labs/botcaster'

const fid = 123
startPolling(fid, YOUR_API_KEY (notification) => {
  console.log(notification)
})
```

And you should be good to go! Feel free to fork and submit pull requests.
