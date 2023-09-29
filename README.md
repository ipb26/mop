# Observable Worker

A functional validation and transformation library.

## Installation

## Usage

```typescript

More examples to come.

import * as M from "mop"

const schema = M.object({
    list: M.arrayByIndex(index => {
        if (index === 0) {
            return M.object({
                id: flow(M.nonBlankString(), M.stringToDate())
            })
        }
    })
})

```

## License

[MIT](https://choosealicense.com/licenses/mit/)
