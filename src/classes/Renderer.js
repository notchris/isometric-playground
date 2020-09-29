import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Grid from './Grid'
import Marker from './Marker'
import BlockHelper from './BlockHelper'
import SelectHelper from './SelectHelper'
import store from '../store'
import WallHelper from "./WallHelper"

export default class Renderer {
  constructor(el) {

    this.el = el

    this.objects = []
    this.mouse = new THREE.Vector2()
    this.blockHelper = null

    this.init()
    this.animate()
  }

  init() {

    // renderer
    this.bbox = this.el.getBoundingClientRect()
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setSize(this.bbox.width, this.bbox.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.el.appendChild(this.renderer.domElement)

    // init scene
    this.initScene()

    // Grid
    this.grid = new Grid(this.scene, 20)

    // Marker
    this.marker = new Marker(this)

    // Helper
    this.blockHelper = new BlockHelper(this, 'floor')
    this.selectHelper = new SelectHelper(this)
    this.wallHelper = new WallHelper(this)
    
    // Events
    window.addEventListener('keypress', (e) => this.keyPress(e.key), false)
    this.renderer.domElement.addEventListener('mousemove', (e) => this.mouseMove(e), false)
    this.renderer.domElement.addEventListener('click', (e) => this.mouseDown(e), false)

    // Resize Event
    this.resizeObserver = new ResizeObserver(() => {
      this.resize()
    })
    this.resizeObserver.observe(this.el)

    // Observe State
    store.subscribe((mutation) => {
      if (mutation.type === 'removeBlock') {
          this.scene.remove(this.scene.getObjectById(mutation.payload).parent)
          for (let i = 0; i < this.objects.length; i += 1) {
            if (this.objects[i].id === mutation.payload) {
              this.objects.splice(i, 1)
            }
          }
          this.selectHelper.deselect()
      }
    })

    return this
  }

  initScene() {
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x999999)

    // Create camera
    this.aspect = this.bbox.width / this.bbox.height
    this.camera = new THREE.OrthographicCamera(
      -this.bbox.width / 2,
      this.bbox.width / 2,
      this.bbox.height / 2,
      -this.bbox.height / 2,
      0.1,
      1000
    )
    this.camera.position.set(20, 20, 20)
    this.camera.zoom = 32
    this.camera.updateProjectionMatrix()

    // Create camera controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableRotate = false
    this.controls.maxPolarAngle = Math.PI / 2

    // Create lights
    this.scene.add(new THREE.AmbientLight(0x404040, 1.0))
    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
    light.position.set(20, 10, 0)
    this.scene.add(light)
  }

  resize() {
    this.bbox = this.el.getBoundingClientRect()
    this.camera.aspect = this.bbox.width / this.bbox.height
    
    this.camera.left = -this.bbox.width / 2
    this.camera.right = this.bbox.width / 2
    this.camera.top = this.bbox.height / 2
    this.camera.bottom = -this.bbox.height / 2
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.bbox.width, this.bbox.height)
    this.render()
  }

  mouseMove (e) {
    this.mouse.x = (e.clientX / this.bbox.width) * 2 - 1
    this.mouse.y = - (e.clientY / this.bbox.height) * 2 + 1
    this.wallHelper.mouseMove()
  }

  mouseDown () {
    if (store.state.mode === 'build' && store.state.tool === 'create') {
      this.blockHelper.addBlock()
    }
    if (store.state.mode === 'build' && store.state.tool === 'select') {
      this.selectHelper.mouseDown()
    }
    if (store.state.mode === 'wall') {
      this.wallHelper.mouseDown()
    }

    this.getPosition()
  }

  getPosition () {
    let x = this.marker.position.x;
    let z = this.marker.position.z;
    console.log(x, z)
  }

  keyPress (key) {
    this.blockHelper.keyPress(key)
  }


  animate() {
    requestAnimationFrame(() => this.animate())
    this.marker.update()
    this.blockHelper.update()
    this.wallHelper.update()
    this.render()
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}
