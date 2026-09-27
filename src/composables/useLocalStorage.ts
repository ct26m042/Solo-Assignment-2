import { ref, watch, type Ref } from 'vue'

// Liest einen Wert beim Start aus localStorage und schreibt ihn bei jeder Änderung zurück.
export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const value = ref(stored ? JSON.parse(stored) as T : initialValue) as Ref<T>

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return value
}
