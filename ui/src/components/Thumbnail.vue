<script setup lang="ts">
const baseurl = 'http://localhost:3000/';

defineProps<{
  image: any;
  prev: any | null;
  next: any | null;
}>();

function openModal(e: MouseEvent) {
  if (!e.target) {
    return;
  }

  const dialog = document.createElement("dialog");
  dialog.classList.add("thumbnail-full");
  document.body.append(dialog);

  const closeButton = document.createElement("button");
  closeButton.classList.add("close");
  dialog.append(closeButton);

  const image = (e.target as HTMLImageElement).cloneNode(true);
  dialog.append(image);
  dialog.showModal();

  dialog.addEventListener("close", (e) => {
    dialog.remove();
  });
  dialog.addEventListener("click", (e) => {
    dialog.close();
  });
}
</script>


<template>
  <div>
    <img @click="openModal" :src="baseurl + image.path" :data-prev="prev ? baseurl + prev.path : null" :data-next="next ? baseurl + next.path : null"/>
  </div>
</template>


<style scoped>
div {
  overflow: hidden;
  background-color: var(--color-background-mute);
  border: 2px solid var(--color-border);
  border-radius: 2px;
  height: 5rem;
  width: 8rem;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;

    cursor: pointer;
    transition: .2s all ease;

    &:hover {
      scale: 1.1;
    }
  }
}
</style>


<style>
dialog.thumbnail-full {
  margin: auto;
  display: flex;

  .close {
    position: fixed;
    right: 1rem;
    top: 1rem;
    background: var(--color-background);
  }
}
</style>
