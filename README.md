# Observable Worker

A functional validation and transformation library, based on fp-ts.

## Installation

## Usage

```typescript

More examples to come.

import * as M from "mop"

const schema = M.object({
    list: flow(
        M.minElem(2),
        M.arrayByIndex(index => {
            if (index === 0) {
                return M.object({
                    id: flow(M.nonBlankString(), M.startsWith("FIRST"))
                })
            }
            else {
                return M.object({
                    id: flow(M.nonBlankString())
                })
            }
        })
    )
})

```

## License

[MIT](https://choosealicense.com/licenses/mit/)
