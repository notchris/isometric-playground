import * as THREE from "three"
import { MeshLine, MeshLineMaterial} from 'three.meshline';
import store from "../store"

export default class WallHelper {
    constructor (parent) {
        this.parent = parent
        this.raycaster = new THREE.Raycaster()
        this.init()
        this.lastPoint = new THREE.Vector3()
        this.currentPoint = new THREE.Vector3()
        this.points = []
        this.line = null
        this.closed = false

        const texture_roof = new THREE.TextureLoader().load('textures/roof15.jpg')
        texture_roof.wrapS = THREE.RepeatWrapping
        texture_roof.wrapT = THREE.RepeatWrapping
        texture_roof.repeat.set(2, 2)
        this.materialRoof = new THREE.MeshPhongMaterial({
            map: texture_roof,
            flatShading: true
        })

        return this
    }

    init () {

        this.lineMaterial = new MeshLineMaterial({
            color: 0xffff00,
            lineWidth: 0.1,
            sizeAttenuation: 1,
            resolution: new THREE.Vector2(this.parent.bbox.width, this.parent.bbox.height)
        })
        this.points = []
        this.line = new MeshLine();
        this.line.setPoints(this.points);
        this.lineMesh = new THREE.Mesh(this.line, this.lineMaterial);
        this.parent.scene.add(this.lineMesh)

    }

    mouseDown () {
        if (this.closed) return
        if (this.lineMesh) {
            this.parent.scene.remove(this.lineMesh)
        }

        if (this.points.length) {
            let dis = this.points[this.points.length - 1].distanceTo(this.lastPoint)
            if (dis === 1) {
                let v1 = new THREE.Vector3().copy(this.points[this.points.length - 1])
                let v2 = new THREE.Vector3().copy(this.lastPoint)
                let angle = Math.atan2(v1.x - v2.x, v1.z - v2.z) * 180 / Math.PI;


                this.points.push(new THREE.Vector3().copy(this.lastPoint))
                let wall = new THREE.Mesh(
                    new THREE.BoxBufferGeometry(0.1,3,1),
                    new THREE.MeshPhongMaterial()
                )
                wall.geometry.translate(0, 1.5, 0.5)
                this.parent.scene.add(wall)
                wall.position.copy(this.lastPoint)
                wall.rotation.y = THREE.MathUtils.degToRad(angle)

                if (this.lastPoint.equals(this.points[0])) {
                    this.closed = true
                    this.createRoof()
                }
            }
        } else {
            this.points.push(new THREE.Vector3().copy(this.lastPoint))
        }

        this.line = new MeshLine();
        this.line.setPoints(this.points);
        this.lineMesh = new THREE.Mesh(this.line, this.lineMaterial);
        this.lineMesh.position.y += 0.1
        this.parent.scene.add(this.lineMesh)
    }

    createRoof () {
        let shape = new THREE.Shape()
        shape.moveTo(this.points[0].x, this.points[0].z)
        this.points.forEach((pt) => {
            shape.lineTo(pt.x, pt.z)
        })
        shape.lineTo(this.points[0].x, this.points[0].z)
        let extrudeSettings = {
            steps: 2,
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: -0.4,
            bevelSegments: 1
        }
        let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
        let mesh = new THREE.Mesh(geometry, this.materialRoof)
        this.parent.scene.add(mesh)
        mesh.rotation.x = Math.PI/2
        mesh.position.y += 3

        

        
    }

    mouseMove () {
        this.rayCast()
        
        if (this.points.length) {
            if (this.closed) return
            this.updateHelper()
        }
        
    }

    updateHelper () {
        if (this.helperLineMesh) {
            this.parent.scene.remove(this.helperLineMesh)
        }

        let dis = this.points[this.points.length - 1].distanceTo(this.lastPoint)
        if (dis === 1) {
            this.helperLine = new MeshLine();
            this.helperLine.setPoints([
                this.points[this.points.length - 1],
                this.lastPoint
            ])
            this.helperLineMesh = new THREE.Mesh(this.helperLine, this.lineMaterial);
            this.helperLineMesh.position.y += 0.1
            this.parent.scene.add(this.helperLineMesh)
        }
    }

    rayCast () {
        this.raycaster.setFromCamera(this.parent.mouse, this.parent.camera)
        let intersect = this.raycaster.intersectObject(this.parent.grid.mesh)
        if (intersect.length) {
            let int = intersect[0]
            let vertices = [
              int.face.a,
              int.face.b,
              int.face.c
            ]

            vertices.forEach((vId, i) => {
              vertices[i] = this.parent.grid.mesh.geometry.vertices[vId].clone()
              vertices[i].l2w = this.parent.grid.mesh.localToWorld(vertices[i].clone())
              vertices[i].id = vId
              vertices[i].index = i
              vertices[i].distance = vertices[i].l2w.distanceTo(int.point)
            })
            
            vertices.sort( function(a,b){
              return a.distance - b.distance
            })

            if (vertices.length !== 0) {
                this.lastPoint = vertices[0]
            }
        }
    }
    
    update () {
        if (store.state.mode === 'wall') {
            //this.marker.visible = true;
        } else {
            //this.marker.visible = false;
        }
    }
}