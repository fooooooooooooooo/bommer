<script setup lang="ts">
import { computed } from 'vue';
import { findUnitPrice, type Part } from '../util';
import { X } from 'lucide-vue-next';

type Props = {
  part: Part;
  assemblies: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:part', 'delete']);

function updateQuantity(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target.value === '') {
    return;
  }

  const quantity = parseInt(target.value, 10);

  emit('update:part', { ...props.part, quantity });
}

const unitPrice = computed(() => {
  return findUnitPrice(props.part.unitPrices, props.part.quantity * props.assemblies);
});

function updateName(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('update:part', { ...props.part, name: target.value });
}
</script>

<template>
  <div class="part assembly-grid">
    <input type="text" :value="part.name" @input="updateName" class="w-32 wicked">
    <span>{{ part.id }}</span>
    <input type="number" :value="part.quantity" @input="updateQuantity" min="1">
    <span class="d">${{ unitPrice.price.toFixed(2) }}</span>
    <span class="d">${{ (unitPrice.price * part.quantity).toFixed(2) }}</span>
    <span class="d">${{ unitPrice.extended.toFixed(2) }}</span>
    <button class="delete-button hidden w-[24px] h-[24px] text-red-500 hover:bg-neutral-600 rounded-md"
      @click="$emit('delete')">
      <X />
    </button>
  </div>
</template>

<style>
.part {
  @apply px-2;
  height: 36px;
}

.part>span {
  @apply text-sm;
}

.part>input {
  @apply px-1 text-sm w-16 h-6 min-h-0;
}

.part>.d {
  @apply text-green-400 text-sm;
}

.wicked {
  @apply !p-0 !bg-transparent !w-full !ring-0;
}
</style>
