import * as THREE from 'three'

export default class Marker {
    constructor (parent) {
        this.parent = parent
        this.scene = this.parent.scene
        this.plane = this.parent.grid.plane
        this.raycaster = new THREE.Raycaster()
        this.position = new THREE.Vector3()

        return this
    }

    update () {
        this.raycaster.setFromCamera(this.parent.mouse, this.parent.camera)
        this.raycaster.ray.intersectPlane(this.plane, this.position)
        this.position.clamp(this.parent.grid.limMin, this.parent.grid.limMax)
        this.position.x = Math.floor(this.position.x / this.parent.grid.cellSize) * this.parent.grid.cellSize
        this.position.z = Math.ceil(this.position.z / this.parent.grid.cellSize) * this.parent.grid.cellSize
    }
}