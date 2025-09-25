<template>
  <div class="height-50">
    {{ props.tite }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue-demi'
const props = defineProps({
  tite: {
    type: String,
    default: () => ''
  }
})
onMounted(() => {
  console.log(123)
})
</script>

<style lang="scss" scoped>
.height-50 {
  height: 50px;
  width: 100%;
  background-color: #fff;
  line-height: 50px;
  font-weight: 700;
  margin-top: 50px;
  padding-left: 20px;
}
</style>
