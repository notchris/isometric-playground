<template>
  <div class="create">
      <select @change="setActiveBlock($event)">
        <option
          v-for="(block, i) in blocks"
          :key="`block_${i}`"
          :selected="block.id === activeBlock"
          :value="block.id"
        >
          {{block.id}}
        </option>
      </select>
  </div>
</template>

<script>

export default {
  name: 'Create',
  computed: {
    blocks () {
      return this.$store.state.blocks
    },
    activeBlock () {
      return this.$store.state.activeBlock
    }
  },
  methods: {
    setActiveBlock (event) {
      this.$store.commit('setActiveBlock', event.target.value)
    }
  }
}
</script>
