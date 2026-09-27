<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from './components/BaseCard.vue'
import SearchBar from './components/SearchBar.vue'
import { useNotes } from './composables/useNotes'

const { addNote, deleteNote, filteredNotes } = useNotes()

const search = ref('')
const title = ref('')
const content = ref('')
const tagsInput = ref('')

const visibleNotes = filteredNotes(search)

function submitNote(): void {
  const trimmedTitle = title.value.trim()
  const trimmedContent = content.value.trim()
  if (!trimmedTitle || !trimmedContent) {
    return
  }

  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  addNote({ title: trimmedTitle, content: trimmedContent, tags })
  title.value = ''
  content.value = ''
  tagsInput.value = ''
}

function removeNote(id: number): void {
  deleteNote(id)
}
</script>

<template>
  <main class="app">
    <header class="hero">
      <h1>QuickNotes</h1>
      <p>Notizen mit Titel, Text und Tags. Alles bleibt in diesem Browser gespeichert.</p>
    </header>

    <BaseCard>
      <template #header>Neue Notiz</template>
      <form class="form" @submit.prevent="submitNote">
        <label>
          Titel
          <input v-model="title" type="text" required placeholder="Titel">
        </label>
        <label>
          Text
          <textarea v-model="content" required rows="4" placeholder="Was möchtest du festhalten?"></textarea>
        </label>
        <label>
          Tags
          <input v-model="tagsInput" type="text" placeholder="z. B. uni, vue, idee">
        </label>
        <button type="submit">Notiz speichern</button>
      </form>
    </BaseCard>

    <SearchBar v-model="search" />

    <p v-if="visibleNotes.length === 0" class="empty">
      {{ search.trim() ? 'Keine Notizen zu dieser Suche.' : 'Noch keine Notizen.' }}
    </p>

    <section v-else class="notes">
      <BaseCard v-for="note in visibleNotes" :key="note.id">
        <template #header>
          <span>{{ note.title }}</span>
          <button type="button" class="delete" @click="removeNote(note.id)">Löschen</button>
        </template>
        <p class="content">{{ note.content }}</p>
        <ul v-if="note.tags.length" class="tags">
          <li v-for="tag in note.tags" :key="tag">{{ tag }}</li>
        </ul>
      </BaseCard>
    </section>
  </main>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px 64px;
  display: grid;
  gap: 16px;
}

.hero h1 {
  margin: 0 0 4px;
  font-size: 2rem;
}

.hero p {
  margin: 0;
  color: #57534e;
}

.form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d6d0c6;
  border-radius: 10px;
  background: #fff;
}

button {
  justify-self: start;
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  background: #1c1917;
  color: #fffdf8;
  cursor: pointer;
}

.notes {
  display: grid;
  gap: 12px;
}

.content {
  margin: 0;
  white-space: pre-wrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 2px 8px;
  border-radius: 999px;
  background: #efe8dc;
  font-size: 0.85rem;
}

.delete {
  padding: 6px 10px;
  background: transparent;
  color: #9f1239;
  border: 1px solid #fecdd3;
}

.empty {
  margin: 0;
  color: #57534e;
}
</style>
