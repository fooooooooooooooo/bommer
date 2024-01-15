<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const textarea = ref<HTMLTextAreaElement | null>(null);

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

watch(props, () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto';

    nextTick(() => {
      if (textarea.value) {
        textarea.value.style.height = Math.min(textarea.value.scrollHeight, 600) + 'px';
      }
    });
  }
});

</script>

<template>
  <textarea ref="textarea" class="w-full" :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
</template>
