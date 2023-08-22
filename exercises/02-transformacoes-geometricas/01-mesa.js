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
const camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
const material = setDefaultMaterial(); // create a basic material
const light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
const orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

// Show axes (parameter is size of each axis)
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
const plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

const tableTopGeometry = new THREE.BoxGeometry(1, 1, 1);
const tableTop = new THREE.Mesh(tableTopGeometry, material);
tableTop.translateY(3.15);
tableTop.scale.set(11, 0.3, 6);
scene.add(tableTop);

const foot1Geometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
const foot1 = new THREE.Mesh(foot1Geometry, material);
foot1.scale.set(1.0 / 11, 1.0 / 0.3, 1.0 / 6);
tableTop.add(foot1);



// Use this to show information onscreen
const controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}