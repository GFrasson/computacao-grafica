import * as THREE from  'three';
import GUI from '../../libs/util/dat.gui.module.js'
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {setDefaultMaterial,
        onWindowResize} from "../../libs/util/util.js";
import {loadLightPostScene} from "../../libs/util/utilScenes.js";

const scene = new THREE.Scene();    // Create main scene

const renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type  = THREE.VSMShadowMap;
renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(5, 5, 5);
camera.up.set( 0, 1, 0 );

const orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );

const ambientLight = new THREE.AmbientLight('rgb(80, 80, 80)');
scene.add(ambientLight);

let dirPosition = new THREE.Vector3(2, 2, 4);
const dirLight = new THREE.DirectionalLight('white', 0.2);
dirLight.position.copy(dirPosition);
//dirLight.castShadow = true;
scene.add(dirLight);

const spotlightPosition = new THREE.Vector3(1.3, 3, 0);
const spotlight = new THREE.SpotLight('rgb(255,255,255)');
spotlight.position.copy(spotlightPosition);
spotlight.angle = THREE.MathUtils.degToRad(45);
spotlight.target.position.set(2.0, 0.0, 0.0);
spotlight.target.updateMatrixWorld();
spotlight.castShadow = true;
spotlight.penumbra = 0.5;
spotlight.shadow.bias = -0.0005;

spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;

spotlight.shadow.camera.near = 0.1;
spotlight.shadow.camera.far = 1000;
spotlight.shadow.camera.fov = 30;

scene.add(spotlight);

const boxGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const boxMaterial1 = setDefaultMaterial();
const box1 = new THREE.Mesh(boxGeometry, boxMaterial1);
box1.position.set(3.0, 0.5, 0.0);
box1.castShadow = true;
scene.add(box1);

const boxMaterial2 = setDefaultMaterial('green');
const box2 = new THREE.Mesh(boxGeometry, boxMaterial2);
box2.position.set(3.0, 0.5, 2.0);
box2.castShadow = true;
scene.add(box2);

const cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 32);
const cylinderMaterial1 = setDefaultMaterial('yellow');
const cylinder1 = new THREE.Mesh(cylinderGeometry, cylinderMaterial1);
cylinder1.position.set(2.0, 0.5, -2.0);
cylinder1.castShadow = true;
scene.add(cylinder1);

const cylinderMaterial2 = setDefaultMaterial('pink');
const cylinder2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial2);
cylinder2.position.set(0.0, 0.5, 3.0);
cylinder2.castShadow = true;
scene.add(cylinder2);

// Load default scene
loadLightPostScene(scene);

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}