import * as THREE from 'three';
import GUI from '../../libs/util/dat.gui.module.js'
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  SecondaryBox,
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

// "Moving" box
const movingMessage = new SecondaryBox("");
movingMessage.changeStyle("rgba(0,0,0,0)", "yellow", "25px", "ubuntu");

// create the ground plane
const plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

const sphere1 = new THREE.Mesh(sphereGeometry, material);
//sphere1.castShadow = true;
sphere1.position.set(-8.0, 1.0, -4.0);
scene.add(sphere1);

const sphere2 = new THREE.Mesh(sphereGeometry, material);
sphere2.position.set(-8.0, 1.0, 4.0);
scene.add(sphere2);

const lerpConfigSphere1 = {
  destination: new THREE.Vector3(8.0, 1.0, -4.0),
  alpha: 0.05,
  move: false
}

const lerpConfigSphere2 = {
  destination: new THREE.Vector3(8.0, 1.0, 4.0),
  alpha: 0.02,
  move: false
}

function moveSphere(sphere, lerpConfig) {
  sphere.position.lerp(lerpConfig.destination, lerpConfig.alpha);
}

function stopWhenCloseEnough(obj, lerpConfig) {
  let maxDiff = 0.1;
  let diffDist = obj.position.distanceTo(lerpConfig.destination);
  movingMessage.changeMessage("Moving...");

  if (diffDist < maxDiff) {
    lerpConfig.move = false;
    movingMessage.changeMessage("");
  }
}

(
  function buildInterface() {
    const controls = new function() {
      this.startSphere1Movement = () => {
        lerpConfigSphere1.move = true;
      };

      this.startSphere2Movement = () => {
        lerpConfigSphere2.move = true;
      };

      this.reset = () => {
        sphere1.position.set(-8.0, 1.0, -4.0);
        sphere2.position.set(-8.0, 1.0, 4.0);
        lerpConfigSphere1.move = false;
        lerpConfigSphere2.move = false;
        movingMessage.changeMessage("");
      }
    };

    let gui = new GUI();
    let folder = gui.addFolder("Options");
    folder.open();
    folder.add(controls, 'startSphere1Movement').name("Esfera 1");
    folder.add(controls, 'startSphere2Movement').name("Esfera 2");
    folder.add(controls, 'reset').name("Reset");
  }
)();

render();
function render() {
  if (lerpConfigSphere1.move) {
    moveSphere(sphere1, lerpConfigSphere1);
    stopWhenCloseEnough(sphere1, lerpConfigSphere1);
  }

  if (lerpConfigSphere2.move) {
    moveSphere(sphere2, lerpConfigSphere2);
    stopWhenCloseEnough(sphere2, lerpConfigSphere2);
  }

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}