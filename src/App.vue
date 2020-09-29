<template>
  <div id="app">
    <split-pane :min-percent='20' :default-percent='80' split="horizontal">
      <template slot="paneL">
        <div class="tabs">
          <div class="btn-group btn-group-sm">
            <button type="button" @click="setMode('build')" :disabled="mode === 'build'" class="btn btn-light">Build</button>
            <button type="button" @click="setMode('wall')" :disabled="mode === 'wall'" class="btn btn-light">Wall</button>
            <button type="button" @click="setMode('settings')" :disabled="mode === 'settings'" class="btn btn-light">Settings</button>
          </div>
        </div>
        <Render/>
      </template>
      <template slot="paneR">
        <div class="panes">
          <div v-show="mode === 'build'" class="pane">
            <div class="tabs_tools">
              <div class="btn-group btn-group-sm">
                <button type="button" @click="setTool('select')" :disabled="tool === 'select'" class="btn btn-secondary">Select</button>
                <button type="button" @click="setTool('create')" :disabled="tool === 'create'" class="btn btn-secondary">Create</button>
              </div>
            </div>
            <div v-show="tool === 'select'" class="tools select">
              <Selected/>
            </div>
            <div v-show="tool === 'create'" class="tools create">
              <Create/>
            </div>
          </div>
          <div v-show="mode === 'wall'" class="pane">Wall</div>
          <div v-show="mode === 'settings'" class="pane">Settings</div>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import Render from './components/Render.vue'
import Create from './components/Create.vue'
import Selected from './components/Selected.vue'

export default {
  name: 'App',
  components: {
    Render,
    Create,
    Selected
  },
  methods: {
    setMode (mode) {
      this.$store.commit('setMode', mode)
    },
    setTool (tool) {
      this.$store.commit('setTool', tool)
    }
  },
  computed: {
    mode () {
      return this.$store.state.mode
    },
    tool () {
      return this.$store.state.tool
    }
  }
}
</script>