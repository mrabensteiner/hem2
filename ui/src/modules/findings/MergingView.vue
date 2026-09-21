<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRoute } from 'vue-router';
import { useProjects } from '../projects/useProjects.ts';
import IconSave from "@/components/icons/IconSave.vue";
import * as listmerger from 'listmerger/src/lib/index.ts';

const route = useRoute();

let itemsbase = {
  "merged": [],
  "originlists": []
};
const items = ref<any>({itemsbase});

const severity_template = `
<div class='formgroup'>
  <label>Severity</label>
  <select name="severity">
    <option value="4">Catastrophic Problem</option>
    <option value="3">Major Problem</option>
    <option value="2">Minor Problem</option>
    <option value="1">Cosmetic Problem only</option>
    <option value="0">Not a Problem at all</option>
  </select>
</div>
`

const item_template = `
<summary {{#mergedinto}}title="Merged into '{{title}}'"{{/mergedinto}}>
  <span class="summary-move move" title="Move to Merged List"></span>
  <span class="summary-moveback move" title="Move back to {{parent}}"></span>
  <span class="summary-triangle" title="Open Item"></span>
  <span class="title" data-edit="title" contenteditable='plaintext-only'>{{title}}</span>
{{#titleimg}}<img class='thumbnail' src='{{src}}'/>{{/titleimg}}
</summary>

<section>

{{#author.length}}
  <div>
    <label class="editable">Author</label>
    <span class="selectedit" data-name="author" data-values="{{author}}" data-mode="multiple" data-options='["John Doe","Max Mustermann","Mario Rossi"]'>
    {{#author}}<span class='enum'>{{.}}</span>{{/author}}
    </span>
  </div>
{{/author.length}}
{{#category.length}}
  <div>
    <label class="editable">Category</label>
    <span class="selectedit" data-name="category" data-values="{{category}}" data-mode="multiple" data-options='[
      "Visibility of System Status",
      "Match Between the System and the Real World",
      "User Control and Freedom",
      "Consistency and Standards",
      "Error Prevention",
      "Recognition Rather than Recall",
      "Flexibility and Efficiency of Use",
      "Aesthetic and Minimalist Design",
      "Help Users Recognize, Diagnose, and Recover from Errors",
      "Help and Documentation"]'>
    {{#category}}<span class='enum'>{{.}}</span>{{/category}}
    </span>
  </div>
{{/category.length}}

{{#images.length}}
<div>
  <label class="editable">Images</label>
  <div class="imageedit">
  {{#images}}
      <div class="imageedit-container{{^active}} imageedit-inactive{{/active}}"><img class="thumbnail" src="{{src}}"/></div>
  {{/images}}
  </div>
</div>
{{/images.length}}

{{#severity}}
<div>
  <label class="editable">Severity</label>
  <span class="severity severity-{{.}} selectedit" data-name="severity" data-values="{{.}}" data-mode="class" data-class="severity-" data-options='{
    "0": "Not a Problem at all", "1": "Cosmetic Problem only", "2": "Minor Problem", "3": "Major Problem", "4": "Catastrophic Problem"
  }'>
</div>
{{/severity}}

{{#description}}
<div>
  <label class="editable">Description</label>
  <div data-edit="description" contenteditable="none">{{.}}</div>
</div>
{{/description}}

{{#parent}}
<div class="origin">
<hr class="margin-bottom"/>
<label>Origin List</label>
<a href="#{{id}}">{{.}}</a>
</div>
{{/parent}}

{{#mergedinto}}
<hr class="margin-bottom"/>
<label>Merged into</label>
<a href="#{{mergedinto.id}}">{{mergedinto.title}}</a>
<img class="detach" data-from="{{parent_id}}" data-to="{{mergedinto.id}}" src="icons/detach.svg"
  title="Detach this item from '{{mergedinto.title}}'" alt="Detach"/>
{{/mergedinto}}

{{#mergedfrom.length}}
<hr class="margin-bottom"/>
<label>Merged from</label>
{{#mergedfrom}}
  <span class="enum">
    <a href="#{{id}}">{{#parent}}{{.}}: {{/parent}}{{title}}</a>
    <img href="#" class="detach" data-from="{{id}}" data-to="{{parent_id}}" src="icons/detach.svg"
      title="Detach '{{title}}' from this merged item" alt="Detach"/>
  </span>
{{/mergedfrom}}
{{/mergedfrom.length}}

</div>
</section>
`;

const dialog_template = `
<h3>{{#parent}}{{.}}: {{/parent}}{{title}}</h3>

{{#author.length}}
  <div>
    <label>Author</label>
    {{#author}}<span class='enum'>{{.}}</span>{{/author}}
  </div>
{{/author.length}}
{{#category.length}}
  <div>
    <label>Category</label>
    {{#category}}<span class='enum'>{{.}}</span>{{/category}}
  </div>
{{/category.length}}
<div>
  {{#images.length}}
    <label>Images</label>
    {{#images}}
      {{#active}}<div><img class='thumbnail' src='{{src}}'/></div>{{/active}}
    {{/images}}
  {{/images.length}}
</div>

{{#severity}}
<div>
  <label>Severity</label>
  <span class="severity severity-{{.}}"></span>
</div>
{{/severity}}

{{#description}}
  <label>Description</label>
    {{.}}
{{/description}}


<div>
{{#mergedfrom.length}}
<hr/>
<label>Merged from</label>
{{#mergedfrom}}<span class="enum">{{parent}}: {{title}}</span>{{/mergedfrom}}
{{/mergedfrom.length}}
</div>
`;

const merge_template = `
<h2>{{action}}</h2>

<div class='formgroup'>
  <label>Title</label>
  <input name='title' value="{{title}}">
</div>

{{#category.length}}
  <div>
    <label>Category</label>
    <span class="selectedit" data-name="category" data-values="{{category}}" data-mode="multiple" data-options='[
      "Visibility of System Status",
      "Match Between the System and the Real World",
      "User Control and Freedom",
      "Consistency and Standards",
      "Error Prevention",
      "Recognition Rather than Recall",
      "Flexibility and Efficiency of Use",
      "Aesthetic and Minimalist Design",
      "Help Users Recognize, Diagnose, and Recover from Errors",
      "Help and Documentation"]'>
    {{#category}}<span class='enum'>{{.}}</span>{{/category}}
    </span>
  </div>
{{/category.length}}

${severity_template}

<div class='formgroup'>
  <label>Description</label>
  <textarea name='description'>{{description}}</textarea>
</div>
`;


// TODO rewrite for vue

function image_edit(editContainer) {
  let active = editContainer.dataset.active == "true";
  editContainer.dataset.active = !active;
  const start_order = Array.from(editContainer.children).map(container => container.querySelector("img").src);

  editContainer.tabIndex = 0;
  window.getSelection().empty();

  let draggedImage = null;

  editContainer.addEventListener("dragstart", (e) => {
    if (e.target.closest(".imageedit-container")) {
      draggedImage = e.target.closest(".imageedit-container");

      e.dataTransfer.setData("inner", "true");
    }
  });

  editContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const image = e.target.closest(".imageedit-container");

    if (image && image !== draggedImage) {
      const rect = image.getBoundingClientRect();
      const next = (e.clientX > rect.left + rect.width / 2) ? image.nextElementSibling : image;

      let bar = document.querySelector(".arrangebar");

      if (bar == undefined) {
        bar = document.createElement("hr");
        bar.classList.add("arrangebar");
      } else if (bar.nextElementSibling == next) {
        return;
      }

      if (next != undefined) {
        editContainer.insertBefore(bar, next)
      } else {
        editContainer.append(bar)
      }
    }
  });

  editContainer.addEventListener('dragend', (e) => {
    const bar = document.querySelector(".arrangebar");
    const image = e.target.closest(".imageedit-container");

    if (bar && image) {
      editContainer.insertBefore(image, bar);
      bar.remove();

      const element = editContainer.closest(".item");

      if (!element) {
        return;
      }

      const id = element.id;
      const order = Array.from(editContainer.children).map(container => container.querySelector("img").src);
    }
  });

  return function () {
    editContainer.dataset.active = false;
    const element = editContainer.closest(".item");
    const id = element.id;

    const end_order = Array.from(editContainer.children).map(container => {
      return {
        "active": !container.classList.contains("imageedit-inactive"),
        "src": container.querySelector("img").src
      }
    });

    if (JSON.stringify(start_order) != JSON.stringify(end_order)) {
      listmerger.edit(element.id, "images", end_order);
    }
  }
}

function select_edit(selectTarget) {
  const innerText = selectTarget.innerHTML;
  let preserveclassname = "";
  const name = selectTarget.dataset.name;
  let options = JSON.parse(selectTarget.dataset.options);
  let values = selectTarget.dataset.values;

  if(Array.isArray(options)) {
    options = Object.fromEntries(
      options.map(key => [key, key])
    );
  }

  try {
    values = JSON.parse(values);
  } catch {
    values = values.split(',').map(item => item.trim());
  }

  const mode = selectTarget.dataset.mode;
  const classprefix = selectTarget.dataset.class;

  if (mode == "class") {
    selectTarget.classList.forEach(classname => {
      if (classname.startsWith(classprefix)) {
        preserveclassname = classname;
        selectTarget.classList.remove(classname);
      }
    });
  } else {
    selectTarget.innerHTML = "";
  }

  const select = document.createElement("select");
  select.name = name;

  if (mode == "multiple") {
    select.multiple = true;
  }

  Object.entries(options).forEach(element => {
    const option = document.createElement("option");
    option.value = element[0];
    option.innerText = element[1];

    if (Array.isArray(values) && (values.includes(element[0]) || values.includes(element[1]))) {
      option.selected = true;
    } else if (values == element[0] || values == element[1]) {
      option.selected = true;
    }

    select.append(option);
  });
  selectTarget.append(select);
  select.focus();

  return function() {

    if (select.closest("dialog")) {
      return;
    }

    select.remove();
    selectTarget.innerHTML = innerText;

    if (preserveclassname != "") {
      selectTarget.classList.add(preserveclassname);
    }
  };
}

function init_select_edit() {
  const parent = document.getElementById("listmerger");

  parent.addEventListener("dblclicka", (e) => {
    let selectTarget = e.target.closest(".selectedit");
    let imageTarget = e.target.closest(".imageedit");

    if (!selectTarget && !imageTarget) {
      selectTarget = e.target.parentNode.querySelector(":scope > .selectedit");
      imageTarget = e.target.parentNode.querySelector(":scope > .imageedit");
    }

    if (!selectTarget && !imageTarget) {
      return;
    }

    if (imageTarget) {
      image_edit(imageTarget);
    } else {
      select_edit(selectTarget);
    }
  });

  parent.addEventListener("click", (e) => {
    if (e.target.tagName == "LABEL") {
      const inline_edit_element = e.target.parentNode.querySelector("[contenteditable]")
      const image_edit_element = e.target.parentNode.querySelector(".imageedit")
      const select_edit_element = e.target.parentNode.querySelector(".selectedit");
      const label = e.target;

      if (label.classList.contains("editing")) {
        return;
      } else if (inline_edit_element || image_edit_element || select_edit_element) {
        label.classList.add("editing");

        const editable_element = label.parentNode.querySelector("[contenteditable]");
        if (editable_element) {
          editable_element.contentEditable = "plaintext-only";
        }
      }

      let save = function() {};

      if (inline_edit_element) {
        inline_edit_element.focus();
      } else if (image_edit_element) {
        save = image_edit(image_edit_element);
      } else if (select_edit_element) {
        save = select_edit(select_edit_element);
      }

      label.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        save();
        label.classList.remove("editing");
      }, { once: true })
    }

    if (e.target.closest(".imageedit") && e.target.closest(".imageedit").dataset.active == "true") {
      const container = e.target.closest(".imageedit-container");
      if (container) {
        container.classList.toggle("imageedit-inactive");
      }
    }
  });
}

const selectors = {"id": "listmerger"};
const templates = {
  "item": item_template,
  "dialog": dialog_template,
  "merge": merge_template
}

const {
  project,
  loadProject,
} = useProjects();

function setItems() {
  items.value = listmerger.getAllItems();
}

onMounted(() => {
  loadProject(route.params.pid as string).then((data) => {
    const findings = data.Findings;

    const reviewerIds = Map.groupBy(findings, (item: any) => item.user[0].id);
    const lists = Array.from(reviewerIds, ([userId, items]) => ({
      id: userId,
      name: `${items[0].user[0].firstname} ${items[0].user[0].lastname}`,
      items
    }));
    itemsbase['originlists'] = lists;

    init_select_edit();
    listmerger.init(itemsbase, templates, selectors, setItems);
  });
});
</script>

<template>
  <section class="sticky">
    <div>
      <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{project?.title}}</RouterLink>
      <h1>Merge</h1>
    </div>
    <button id="undo" disabled>Undo</button>
    <button id="redo" disabled>Redo</button>
    <button disabled><IconSave class="icon"/> Save</button>
  </section>
  <div class="container" id="listmerger">

    <div class="mergelist-container">
      <p>Merged List <span class="indicator">0</span></p>
      <div class="list" data-role="list" id="mergelist"></div>
    </div>
    <div class="tab-container">
      <select id="detailsselector"></select>
      <div class="tabbar"></div>
    </div>
  </div>
</template>

<style>
@import "listmerger/src/example/listmerger.css" layer(listmerger);
@import "listmerger/src/example/style.css" layer(listmerger);

#listmerger {
  .tabbar > details > section {
    margin-top: -1px;
  }
  .list:not(#mergelist) .item summary .summary-move {
    margin: -1rem 1rem -1rem -1rem !important;
  }
  .list#mergelist .item summary .summary-moveback {
    margin: -1rem -1rem -1rem 1rem !important;
  }
}
</style>
