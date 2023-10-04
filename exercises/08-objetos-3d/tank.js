import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import {
  initCamera,
  setDefaultMaterial,
  onWindowResize,
  createGroundPlaneXZ,
  SecondaryBox,
  getMaxSize
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene

const renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

const loadingMessage = new SecondaryBox("Loading...");

const assetsManager = {
  toon_tank: null,
  allLoaded: false,

  checkLoaded: function () {
    if (!this.allLoaded) {
      if (this.toon_tank) {
        this.allLoaded = true;
        loadingMessage.hide();
      }
    }
  }
};

function fixPosition(obj) {
  // Fix position of the object over the ground plane
  const box = new THREE.Box3().setFromObject(obj);
  if (box.min.y > 0) {
    obj.translateY(-box.min.y);
  }
  else {
    obj.translateY(-1 * box.min.y);
  }

  return obj;
}

function normalizeAndRescale(obj, newScale) {
  const scale = getMaxSize(obj);
  obj.scale.set(newScale * (1.0 / scale), newScale * (1.0 / scale), newScale * (1.0 / scale));

  return obj;
}

function loadGLBFile(modelPath, modelName, visibility, desiredScale) {
  var loader = new GLTFLoader();
  loader.load(modelPath + modelName + '.glb', (gltf) => {
    let obj = gltf.scene;
    obj.name = modelName;
    obj.visible = visibility;
    obj.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
      if (child.material) {
        child.material.side = THREE.DoubleSide;
      }
    });

    obj = normalizeAndRescale(obj, desiredScale);
    obj = fixPosition(obj);

    scene.add(obj);
    assetsManager[modelName] = obj;
  });
}

loadGLBFile('../../assets/objects/', 'toon_tank', true, 1.5);

render();
function render() {
  assetsManager.checkLoaded();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}