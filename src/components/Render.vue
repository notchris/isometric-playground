<template>
  <div class="render">
  </div>
</template>

<script>
import Renderer from '../classes/Renderer'

export default {
  name: 'Render',
  mounted () {
    this.renderer = new Renderer(this.$el)
    
  }
}
</script>
