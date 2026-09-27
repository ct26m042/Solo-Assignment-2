import { computed, unref, type ComputedRef, type Ref } from 'vue'
import type { Note } from '@/types/notes'
import { useLocalStorage } from './useLocalStorage'

type NewNote = Omit<Note, 'id'>

export function useNotes() {
  const notes = useLocalStorage<Note[]>('quicknotes', [])

  function addNote(note: NewNote): void {
    const nextId = notes.value.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
    notes.value.push({
      id: nextId,
      title: note.title,
      content: note.content,
      tags: note.tags ?? [],
    })
  }

  function deleteNote(id: number): void {
    notes.value = notes.value.filter((note) => note.id !== id)
  }

  const availableTags = computed(() => {
    const seen = new Map<string, string>()
    for (const note of notes.value) {
      for (const tag of note.tags ?? []) {
        const trimmed = tag.trim()
        const key = trimmed.toLowerCase()
        if (trimmed && !seen.has(key)) {
          seen.set(key, trimmed)
        }
      }
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b, 'de'))
  })

  function filteredNotes(term: Ref<string> | string, tag: Ref<string> | string = ''): ComputedRef<Note[]> {
    return computed(() => {
      const query = String(unref(term) ?? '').trim().toLowerCase()
      const activeTag = String(unref(tag) ?? '').trim().toLowerCase()

      return notes.value.filter((note) => {
        const title = String(note.title ?? '').toLowerCase()
        const content = String(note.content ?? '').toLowerCase()
        const tags = Array.isArray(note.tags) ? note.tags : []
        const matchesQuery = !query
          || title.includes(query)
          || content.includes(query)
          || tags.some((item) => String(item).toLowerCase().includes(query))
        const matchesTag = !activeTag || tags.some((item) => String(item).toLowerCase() === activeTag)
        return matchesQuery && matchesTag
      })
    })
  }

  return { notes, availableTags, addNote, deleteNote, filteredNotes }
}
