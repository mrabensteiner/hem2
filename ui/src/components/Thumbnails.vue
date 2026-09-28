<script setup lang="ts">
import Thumbnail from "@/components/Thumbnail.vue";

const baseurl = 'http://localhost:3000/';

const props = defineProps<{
  images: any[];
}>();

function openModal(e: MouseEvent) {
  if (!e.target) {
    return;
  }

  const target = e.target as HTMLImageElement;
  let index = Number(target.dataset.index);

  const dialog = document.createElement("dialog");
  dialog.classList.add("thumbnail-full");
  document.body.append(dialog);

  const closeButton = document.createElement("button");
  closeButton.classList.add("close");
  dialog.append(closeButton);

  const prevButton = document.createElement("button");
  prevButton.classList.add("prev");
  prevButton.innerHTML = "<<";
  dialog.append(prevButton);

  const nextButton = document.createElement("button");
  nextButton.classList.add("next");
  nextButton.innerHTML = ">>";
  dialog.append(nextButton);

  const image = target.cloneNode(true) as HTMLImageElement;
  dialog.append(image);
  dialog.showModal();

  dialog.addEventListener("close", (e) => {
    dialog.remove();
  });

  closeButton.addEventListener("click", (e) => {
    dialog.close();
  });

  prevButton.addEventListener("click", (e) => {
    index -= 1;
    index = index < 0 ? props.images.length -1 : index;
    replaceImage(image, index);
  });

  nextButton.addEventListener("click", (e) => {
    index += 1;
    index = index >= props.images.length ? 0 : index;
    replaceImage(image, index);
  });
}

function replaceImage(image: HTMLImageElement, index: number) {
  image.src = baseurl + props.images[index].path;
  image.dataset.index = `${index}`;
}
</script>


<template>
  <div>
    <template v-for="(img, i) in images">
      <Thumbnail @click="openModal" :image="img" :index="i" :prev="images[i-1]" :next="images[i+1]"/>
    </template>
    <span v-if="!images">No images</span>
  </div>
</template>

<style>
button.prev, button.next {
  position: fixed;
  top: 50%;
  margin: 0;
  background-color: #000a;
  color: #fff;
  border: none;

  &:hover {
    background-color: #0007;
  }
}

button.prev {
  left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

button.next {
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>

<style scoped>
div {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  flex: 0 0 48%;

  > div {
    &:first-child {
      flex-basis: 100%;
      width: 20rem;
      height: 100%;
    }
  }
}
</style>
