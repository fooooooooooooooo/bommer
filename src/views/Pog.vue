<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import NewPart from '../components/NewPart.vue';
import Part from '../components/Part.vue';
import { findUnitPrice, type Part as TPart } from '../util';
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import Checkbox from '../components/Checkbox.vue';

type Assembly = {
  count: number;
  parts: TPart[];
}

const assembly = useStorage<Assembly>(
  'assembly', {
  count: 1,
  parts: [
    {
      name: '',
      id: 'BQ21061YFPR',
      unitPrices: [
        { quantity: 1, price: 1.6514 },
        { quantity: 10, price: 1.4287 },
        { quantity: 30, price: 1.3062 },
        { quantity: 100, price: 1.0803 },
        { quantity: 500, price: 1.0198 },
        { quantity: 1000, price: 0.9912 }
      ],
      quantity: 1
    }
  ]
});

// Sales Unit: Piece Full Reel: 3000
// Qty.	Unit Price	Ext. Price
// 1+	US$1.6514	US$ 1.65
// 10+	US$1.4287	US$ 14.29
// 30+	US$1.3062	US$ 39.19
// 100+	US$1.0803	US$ 108.03
// 500+	US$1.0198	US$ 509.90
// 1000+	US$0.9912	US$ 991.20

function onPartChange(part: TPart) {
  const index = assembly.value.parts.findIndex(p => p.id === part.id);
  assembly.value.parts.splice(index, 1, part);
}

function onPartDelete(id: string) {
  const index = assembly.value.parts.findIndex(p => p.id === id);
  assembly.value.parts.splice(index, 1);
}

const adding = ref(false);

function onAdd(part: TPart) {
  assembly.value.parts.push(part);
  adding.value = false;
}

const debug = ref(false);


const perAssembly = computed(() => {
  return assembly.value.parts.reduce((acc, part) => {
    let partCost = part.quantity * findUnitPrice(part.unitPrices, part.quantity * assembly.value.count).price;

    return acc + partCost;
  }, 0);
});

const total = computed(() => {
  return perAssembly.value * assembly.value.count;
});
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex flex-row justify-between">

      <label>
        <span class="w-[150px]">Assembly quantity</span>
        <input type="number" v-model="assembly.count" min="1" />
      </label>

      <label>
        <span>Debug</span>
        <Checkbox v-model="debug" />
      </label>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex justify-end w-full">
        <button class="button" @click="adding = !adding">
          <Plus />
        </button>
      </div>

      <div class="assembly">
        <div class="assembly-grid bg-[#212121] h-10 px-4 text-sm font-medium text-neutral-300">
          <h2>Name</h2>
          <h2>Part</h2>
          <h2>Quantity</h2>
          <h2>Per Part</h2>
          <h2>Per Assembly</h2>
          <h2>Total</h2>
          <h2></h2>
        </div>

        <NewPart v-if="adding" @add="onAdd" class="table-border" />
        <div v-if="!assembly.parts">
          <p>No parts added yet.</p>
        </div>

        <div class="part-container table-border" v-for="part in assembly.parts" :key="part.id">
          <Part :part="part" @update:part="onPartChange" :assemblies="assembly.count" @delete="onPartDelete" />
        </div>
      </div>

      <div class="flex flex-row justify-end">
        <div class="grid grid-cols-2 gap-2">
          <span class="font-medium text-sm">Per assembly:</span>
          <span class="text-sm text-right">${{ perAssembly.toFixed(2) }}</span>

          <span class="font-medium text-sm">Total:</span>
          <span class="text-sm text-right">${{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div v-if="debug">
      <pre>{{ JSON.stringify(assembly, null, 2) }}</pre>
    </div>
  </main>
</template>

<style>
.assembly {
  @apply flex flex-col rounded-md bg-[#191919] overflow-hidden;
}

.table-border {
  border-bottom: 1px solid #2d2d2d;
}

.table-border:last-child {
  border-bottom: none;
}

.part-container {
  @apply flex items-center py-2 px-2;
}

.part-container>.part {
  @apply flex-1;
}

.part-container:hover>.part {
  @apply bg-[#2d2d2d] rounded-md;
}

.part-container:hover .delete-button {
  @apply block;
}

.assembly-grid {
  @apply grid gap-4 items-center;
  grid-template-columns: 1fr 1fr 4rem 1fr 1fr 1fr 2rem;
}
</style>
