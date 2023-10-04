import * as THREE from 'three';
import { ConvexGeometry } from '../../build/jsm/geometries/ConvexGeometry.js';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
  initCamera,
  setDefaultMaterial,
  onWindowResize,
  createGroundPlaneXZ
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene

const renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type  = THREE.PCFSoftShadowMap;
renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

const camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
const material = setDefaultMaterial(); // create a basic material
const orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

// Show axes (parameter is size of each axis)
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
const plane = createGroundPlaneXZ(20, 20);
scene.add(plane);

const ambientLight = new THREE.AmbientLight('rgb(80, 80, 80)');
scene.add(ambientLight);

let dirPosition = new THREE.Vector3(2, 2, 4);
const dirLight = new THREE.DirectionalLight('white', 1);
dirLight.position.copy(dirPosition);
dirLight.castShadow = true;
scene.add(dirLight);

function generatePoints() {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 3),
    new THREE.Vector3(5, 0, 3),
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0, 2, 3),
    new THREE.Vector3(2, 2, 3),
    new THREE.Vector3(2, 2, 0),
  ];

  const sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,0)" });

  const pointCloud = new THREE.Object3D();
  points.forEach((point) => {
    var sphereGeometry = new THREE.SphereGeometry(0.1);
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(point.x, point.y, point.z);
    pointCloud.add(sphere);
  });

  scene.add(pointCloud);

  return points;
}

const localPoints = generatePoints();
const convexGeometry = new ConvexGeometry(localPoints);
const objectMaterial = new THREE.MeshLambertMaterial({
  color: 'green'
});
const object = new THREE.Mesh(convexGeometry, objectMaterial);
object.castShadow = true;
scene.add(object);

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}