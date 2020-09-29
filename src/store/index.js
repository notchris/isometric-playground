import Vue from 'vue'
import Vuex from 'vuex'
import Blocks from '../classes/blocks.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mode: 'build',
    tool: 'create',
    blocks: Blocks,
    activeBlock: 'floor',
    selectedBlock: null,
    objects: []
  },
  mutations: {
    setMode (state, mode) {
      state.mode = mode
    },
    setTool (state, tool) {
      state.tool = tool
    },
    setActiveBlock (state, block) {
      state.activeBlock = block
    },
    setSelectedBlock (state, id) {
      state.selectedBlock = state.objects.filter((o) => o.id === id)[0]
    },
    deselect (state) {
      state.selectedBlock = null
    },
    addBlock (state, data) {
      state.objects.push(data)
    },
    removeBlock (state, id) {
      for (let i = 0; i < state.objects.length; i += 1) {
        if (state.objects[i].id === id) {
          state.objects.splice(i, 1)
        }
      }
    },
    rotateBlock() {
      return true
    }
  },
  actions: {
  },
  modules: {
  }
})
