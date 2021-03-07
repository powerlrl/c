<template>
  <div class="item" :class="{'active': isActive}">
    <slot name="item-text"></slot>
  </div>
</template>

<script>
export default {
  props: {
    currentIndex: {
      type: Number,
      default: 0,
    }
  },
  data(){
    return {
      isActive: true,
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.item {
  width: 100px;
  border: 1px solid #eee;
  text-align: center;
  margin-right: 10px;
  height: 30px;
  line-height: 30px;
}

</style>