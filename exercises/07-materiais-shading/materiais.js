import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import { TeapotGeometry } from '../../build/jsm/geometries/TeapotGeometry.js';
import {
  initCamera,
  onWindowResize,
  createLightSphere,
  createGroundPlaneXZ
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

const camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
const orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

// Show axes (parameter is size of each axis)
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
const plane = createGroundPlaneXZ(20, 20);
scene.add(plane);

(
  function createAmbientLight() {
    const ambientLight = new THREE.AmbientLight('rgb(80, 80, 80)');
    scene.add(ambientLight);
  }
)();

(
  function createDirectionalLight() {
    const directionalLightPosition = new THREE.Vector3(6, 3, 6);
    const directionalLight = new THREE.DirectionalLight('white', 0.8);
    directionalLight.position.copy(directionalLightPosition);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    createLightSphere(scene, 0.1, 10, 10, directionalLightPosition);
  }
)();

const cylinderGeometry = new THREE.CylinderGeometry(0.2, 1, 4);
const cylinderMaterial = new THREE.MeshPhongMaterial({
  color: 'lightblue',
  flatShading: true
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(3, 2, 3);
cylinder.castShadow = true;
scene.add(cylinder);

const teapotGeometry = new TeapotGeometry(1);
const teapotMaterial = new THREE.MeshPhongMaterial({
  color: 'red',
  shininess: '200',
  specular: 'rgb(255, 255, 255)'
});
const teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
teapot.receiveShadow = true;
teapot.castShadow = true;
teapot.position.set(-0.5, 1, 0);
scene.add(teapot);

const sphereGeometry = new THREE.SphereGeometry(1, 12, 12);
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 'lightgreen'
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.receiveShadow = true;
sphere.castShadow = true;
sphere.position.set(-4, 1, -3);
scene.add(sphere);


render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}