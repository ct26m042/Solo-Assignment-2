<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseCard from './components/BaseCard.vue'
import SearchBar from './components/SearchBar.vue'
import { useNotes } from './composables/useNotes'

const { notes, availableTags, addNote, deleteNote, filteredNotes } = useNotes()

const search = ref('')
const selectedTag = ref('')
const title = ref('')
const content = ref('')
const tagsInput = ref('')

const visibleNotes = filteredNotes(search, selectedTag)

watch(availableTags, (tags) => {
  const active = selectedTag.value.toLowerCase()
  if (active && !tags.some((tag) => tag.toLowerCase() === active)) {
    selectedTag.value = ''
  }
})

function toggleTag(tag: string): void {
  selectedTag.value = selectedTag.value.toLowerCase() === tag.toLowerCase() ? '' : tag
}

function isTagActive(tag: string): boolean {
  return selectedTag.value.toLowerCase() === tag.toLowerCase()
}

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

    <div v-if="notes.length" class="filters" role="group" aria-label="Nach Tag filtern">
      <span>Filter</span>
      <button type="button" :class="{ active: !selectedTag }" :aria-pressed="!selectedTag" @click="selectedTag = ''">
        Alle
      </button>
      <button
        v-for="tag in availableTags"
        :key="tag"
        type="button"
        :class="{ active: isTagActive(tag) }"
        :aria-pressed="isTagActive(tag)"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <p v-if="visibleNotes.length === 0" class="empty">
      {{ notes.length ? 'Keine Notizen für diese Filter.' : 'Noch keine Notizen.' }}
    </p>

    <section v-else class="notes">
      <BaseCard v-for="note in visibleNotes" :key="note.id">
        <template #header>
          <span>{{ note.title }}</span>
          <button type="button" class="delete" @click="removeNote(note.id)">Löschen</button>
        </template>
        <p class="content">{{ note.content }}</p>
        <ul v-if="note.tags.length" class="tags">
          <li v-for="tag in note.tags" :key="tag">
            <button type="button" :class="{ active: isTagActive(tag) }" @click="toggleTag(tag)">{{ tag }}</button>
          </li>
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

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filters > span {
  font-size: 0.9rem;
  font-weight: 650;
}

.filters button,
.tags button {
  padding: 4px 10px;
  border: 1px solid #d6d0c6;
  border-radius: 999px;
  background: #fff;
  color: #1c1917;
  font-size: 0.85rem;
}

.filters button.active,
.tags button.active {
  background: #1c1917;
  border-color: #1c1917;
  color: #fffdf8;
}

.tags li {
  list-style: none;
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
