<template>
  <div class="select">
      <div>
        <span>Selected:</span>
        <span v-if="selectedBlock"> {{selectedBlock.id}},{{selectedBlock.type}}</span>
        <span v-else> None</span>
      </div>
      <div v-show="selectedBlock">
        <button @click="removeBlock" type="button">Remove</button>
        <button @click="rotateBlock" type="button">Rotate</button>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Selected',
  computed: {
    selectedBlock () {
      return this.$store.state.selectedBlock
    }
  },
  methods: {
    removeBlock() {
      this.$store.commit('removeBlock', this.selectedBlock.id)
    },
    rotateBlock () {
      this.$store.commit('rotateBlock', this.selectedBlock.id)
    }
  }
}
</script>
