import {Vector3, MeshPhongMaterial, Mesh, Object3D} from "three"
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js"
import store from '../store'

export default class BlockHelper {
    constructor (parent, type) {
        this.parent = parent;
        this.type = type;
        this.obj = null

        this.setType(type)

        store.subscribe((mutation, state) => {
            if (mutation.type === 'setActiveBlock') {
                this.setType(state.activeBlock)
            }
        })

        return this
    }

    setType (type) {
        if (this.obj) {
            this.parent.scene.remove(this.obj)
        }

        this.obj = new Object3D()
        this.type = type
        let points = []
        
        /*if (this.mesh) {
            this.parent.scene.remove(this.mesh)
            this.mesh = null
        }
        if (geometry) {
            geometry.dispose()
            geometry = null
        }*/

        // Set the convex points for this helper
        store.state.blocks.forEach((block) => {
            if (block.id === this.type) {
              block.points.forEach((p) => {
                points.push(new Vector3(p[0], p[1], p[2]))
              })
            }
        })

        // Create and scale the geometry
        let geometry = new ConvexGeometry(points)
        geometry.scale(0.5, 0.5, 0.5)
        geometry.center()
        geometry.computeBoundingBox()
        let offsetY = (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2
        geometry.translate(0, offsetY, 0)
        this.fixGeometry(geometry)

        let material = new MeshPhongMaterial({
            color: 0xff0000
        })
        let mesh = new Mesh(geometry, material)
        this.obj.add(mesh)
        mesh.translateX(0.5)
        mesh.translateZ(-0.5)
        this.parent.scene.add(this.obj)
    }

    fixGeometry (geometry) {
        /*if (!geometry.boundingBox) geometry.computeBoundingBox()
        const sz = geometry.boundingBox.getSize(new Vector3())
        const min = geometry.boundingBox.min
        if (geometry.faceVertexUvs[0].length === 0) {
            for (let i = 0; i < geometry.faces.length; i += 1) {
                geometry.faceVertexUvs[0].push([new Vector2(), new Vector2(), new Vector2()])
            }
        }
        for (let j = 0; j < geometry.faces.length; j += 1) {
            const faceUVs = geometry.faceVertexUvs[0][j]
            const va = geometry.vertices[geometry.faces[j].a]
            const vb = geometry.vertices[geometry.faces[j].b]
            const vc = geometry.vertices[geometry.faces[j].c]
            const vab = new Vector3().copy(vb).sub(va)
            const vac = new Vector3().copy(vc).sub(va)
            const vcross = new Vector3().copy(vab).cross(vac)
            vcross.set(Math.abs(vcross.x), Math.abs(vcross.y), Math.abs(vcross.z))
            const majorAxis = vcross.x > vcross.y ? (vcross.x > vcross.z ? 'x' : vcross.y > vcross.z ? 'y' : vcross.y > vcross.z) : vcross.y > vcross.z ? 'y' : 'z'
            const uAxis = majorAxis === 'x' ? 'y' : majorAxis === 'y' ? 'x' : 'x'
            const vAxis = majorAxis === 'x' ? 'z' : majorAxis === 'y' ? 'z' : 'y'
            faceUVs[0].set((va[uAxis] - min[uAxis]) / sz[uAxis], (va[vAxis] - min[vAxis]) / sz[vAxis])
            faceUVs[1].set((vb[uAxis] - min[uAxis]) / sz[uAxis], (vb[vAxis] - min[vAxis]) / sz[vAxis])
            faceUVs[2].set((vc[uAxis] - min[uAxis]) / sz[uAxis], (vc[vAxis] - min[vAxis]) / sz[vAxis])
        }
        geometry.elementsNeedUpdate = geometry.verticesNeedUpdate = true
        geometry.uvsNeedUpdate = true*/
        return geometry
    }

    addBlock () {
        let obj = new Object3D()

        let mesh = this.obj.children[0].clone()
        obj.add(mesh)
        this.parent.scene.add(obj)
        obj.position.copy(this.parent.marker.position)
        this.parent.objects.push(mesh)

        mesh.material = new MeshPhongMaterial({
            flatShading: true,
        })
    

        
        // add to store
        store.commit('addBlock', {
            id: mesh.id,
            type: this.type,
            position: new Vector3().copy(obj.position)
        })
    }

    keyPress (key) {
        if (key === 'r') {
            this.obj.children[0].rotateY(Math.PI/2)
        }
    }

    update () {
        if (!this.obj) return
        this.obj.position.copy(this.parent.marker.position)
        if (store.state.mode === 'build' && store.state.tool === 'create') {
            this.obj.visible = true;
        } else {
            this.obj.visible = false;
        }
    }
}