import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const renderer = initRenderer();    // Init a basic renderer
const camera = initCamera(new THREE.Vector3(0, 0, 30)); // Init camera in this position
const material = setDefaultMaterial(); // create a basic material
const orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

// Show axes (parameter is size of each axis)
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

const directionalLight = new THREE.DirectionalLight('rgb(255, 255, 255)', 0.8);
directionalLight.position.set(0, 30, 30);

const boxGeometry = new THREE.BoxGeometry(5, 5, 0.5);
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 'rgb(255, 255, 255)',
    
});

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}