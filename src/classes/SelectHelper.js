import {BoxHelper, Raycaster} from "three"
import store from "../store"

export default class SelectHelper {
    constructor (parent) {
        this.parent = parent
        this.helper = new BoxHelper()
        this.parent.scene.add(this.helper)
        this.raycaster = new Raycaster()

        store.subscribe((mutation, state) => {
            if (mutation.type === 'rotateBlock') {
                this.rotate(state.selectedBlock.id)
            }
        })
        return this
    }

    select (id) {
        this.helper.visible = true
        let obj = this.parent.scene.getObjectById(id, true)
        this.helper.position.copy(this.parent.marker.position)
        this.helper.setFromObject(obj)
        store.commit('setSelectedBlock', id)
    }

    rotate (id) {
        let obj = this.parent.scene.getObjectById(id, true)
        obj.rotation.y += Math.PI/2
        this.helper.setFromObject(obj)
        
    }

    deselect () {
        this.helper.visible = false
        store.commit('deselect')
    }

    mouseDown () {
        this.raycaster.setFromCamera(this.parent.mouse, this.parent.camera)
        let intersects = this.raycaster.intersectObjects(this.parent.objects);

        if (intersects.length) {
            this.select(intersects[0].object.id)
        } else {
            this.deselect()
        }
    }
}