<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { ref } from 'vue';
import Textarea from './Textarea.vue';
import { parseLcscPricing, type Part } from '../util';

const emit = defineEmits<{ (e: 'add', value: Part): void }>();

const id = ref('');
const name = ref('');
const quantity = ref(1);
const pricing = ref('');

const error = ref<string | null>(null);

function onAdd() {
  error.value = null;

  const unitPrices = parseLcscPricing(pricing.value);

  if (!unitPrices || unitPrices.length === 0) {
    error.value = 'Invalid pricing';
    return;
  }

  const part: Part = {
    id: id.value,
    name: name.value,
    unitPrices,
    quantity: quantity.value
  };

  emit('add', part);
}
</script>

<template>
  <div class="assembly-grid p-2">
    <input type="text" v-model="name">
    <input type="text" v-model="id">
    <input type="number" v-model="quantity" min="1">
    <div class="col-span-3 flex flex-row gap-4 items-start">
      <Textarea class="flex-grow" v-model="pricing" />
    </div>
    <button @click="onAdd">
      <Check class="text-green-500 hover:text-green-600 h-[32px]" />
    </button>

    <div class="text-red-500 col-span-6" v-if="error">{{ error }}</div>
  </div>
</template>
