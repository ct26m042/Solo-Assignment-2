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

  function filteredNotes(term: Ref<string> | string): ComputedRef<Note[]> {
    return computed(() => {
      const query = String(unref(term) ?? '').trim().toLowerCase()
      if (!query) {
        return notes.value
      }

      return notes.value.filter((note) => {
        const title = String(note.title ?? '').toLowerCase()
        const content = String(note.content ?? '').toLowerCase()
        const tags = Array.isArray(note.tags) ? note.tags : []
        return title.includes(query)
          || content.includes(query)
          || tags.some((tag) => String(tag).toLowerCase().includes(query))
      })
    })
  }

  return { notes, addNote, deleteNote, filteredNotes }
}
