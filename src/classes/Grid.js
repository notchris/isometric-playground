import * as THREE from 'three'

export default class Grid {
    constructor (scene, size) {
        this.scene = scene
        this.size = size
        this.cellSize = 1
        this.limit = this.size / 2
        this.limMin = new THREE.Vector3(-this.limit, 0, -this.limit + this.cellSize)
        this.limMax = new THREE.Vector3(this.limit - this.cellSize, 0, this.limit)
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

        this.init()

        return this;
    }

    init () {
        // Grid Container Object
        this.object = new THREE.Object3D()

        // Tile Mesh (Invisible)
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.size, 1, this.size, this.size, 1, this.size),
            new THREE.MeshPhongMaterial({
                vertexColors: THREE.VertexColors,
                flatShading: true
            })
        )
        this.mesh.geometry.translate(0, -0.5, 0)
        this.mesh.visible = false
        this.object.add(this.mesh)

        // Instanced Floor Test
        this.instanced = new THREE.InstancedMesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial({
                vertexColors: THREE.VertexColors,
                flatShading: true,
                color: '#FFFFFF',
                side: THREE.DoubleSide
            }),
            this.size * this.size
        )
        this.instanced.geometry.faces.forEach((f) => f.color.setHex(0x856E4A))
        this.instanced.geometry.faces[4].color.setHex(0x506E6C)
        this.instanced.geometry.faces[5].color.setHex(0x506E6C)

        this.scene.add(this.instanced)

        let i = -1
        let dummy = new THREE.Object3D()
        let offset = 0
        for (let x = 0; x < this.size; x += 1) {
            for (let z = 0; z < this.size; z += 1) {
                dummy.position.set(offset - x, 0, offset - z)
                dummy.updateMatrix()
                this.instanced.setMatrixAt(i += 1, dummy.matrix)
            }
        }

        this.instanced.instanceMatrix.needsUpdate = true

        this.instanced.translateX(this.size/2)
        this.instanced.translateZ(this.size/2)
        this.instanced.geometry.translate(-0.5, -0.5, -0.5)

        dummy.position.set(-100,-100,-100)
        dummy.updateMatrix();
        this.instanced.setMatrixAt(12, dummy.matrix );

        this.object.add(new THREE.GridHelper(this.size, this.size, '#000000', '#BBBBBB'))

        this.scene.add(this.object)
    }

    updateSize (size) {
        this.scene.remove(this.object)
        this.size = size
        this.limit = this.size / 2
        this.limMin = new THREE.Vector3(-this.limit, 0, -this.limit + this.cellSize)
        this.limMax = new THREE.Vector3(this.limit - this.cellSize, 0, this.limit)
        this.init()
    }
}