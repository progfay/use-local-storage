## `useLocalStorage(key)` hooks

__⚠️ This code has not yet been published in npm registry.__

```tsx
import {
  setlocalStorageItem,
  useLocalStorage,
} from '@progfay/use-local-storage'

const KEY = 'RANDOM_VALUE'

const ComponentA = () => (
  <button onClick={() => setLocalStorageItem(Math.random().toFixed(10))}>
    Set random value for localStorage
  </button>
)

const ComponentB = () => {
  const randomValue = useLocalStorage(KEY)
  return (
    <p>
      random value in localStorage: {randomValue}
    </p>
  )
}

const App = () => (
  <>
    <ComponentA />
    <ComponentB />
  </>
)
```
