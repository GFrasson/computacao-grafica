import * as THREE from 'three';
import KeyboardState from '../../libs/util/KeyboardState.js'
import {
  initRenderer,
  initCamera,
  onWindowResize,
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const renderer = initRenderer();    // Init a basic renderer
const camera = initCamera(new THREE.Vector3(0, 0, 10)); // Init camera in this position
const keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

const ambientLight = new THREE.AmbientLight('rgb(80, 80, 80)');
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('rgb(255, 255, 255)', 1);
directionalLight.position.set(0, 30, 30);
scene.add(directionalLight);

const boxGeometry = new THREE.BoxGeometry(5, 5, 0.5);
const boxMaterials = [
  setMaterial('../../assets/textures/NormalMapping/crossSide.png'), //x+
  setMaterial('../../assets/textures/NormalMapping/crossSide.png'), //x-
  setMaterial('../../assets/textures/NormalMapping/crossTop.png'), //y+
  setMaterial('../../assets/textures/NormalMapping/crossTop.png'), //y-
  setMaterial('../../assets/textures/NormalMapping/cross.png', '../../assets/textures/NormalMapping/crossNormal.png', new THREE.Vector2(1.2, 1.2)), //z+
  setMaterial('../../assets/textures/NormalMapping/cross.png', '../../assets/textures/NormalMapping/crossNormal.png', new THREE.Vector2(1.2, 1.2)) //z-
];
const box = new THREE.Mesh(boxGeometry, boxMaterials);
scene.add(box);

function setMaterial(textureFile, normalMapFile = null, normalMapScale = null) {
  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({
    color: 'rgb(255, 255, 255)',
    map: textureLoader.load(textureFile),
    ...(normalMapFile && {
      normalMap: textureLoader.load(normalMapFile),
      normalScale: normalMapScale ?? new THREE.Vector2(1, 1)
    })
  });

  material.map.wrapS = THREE.RepeatWrapping;
  material.map.wrapT = THREE.RepeatWrapping;
  material.map.minFilter = THREE.LinearFilter;
  material.map.magFilter = THREE.LinearFilter;

  return material;
}

function keyboardUpdate() {
  keyboard.update();

  if (keyboard.pressed('W')) {
    box.rotateX(0.02);
  }

  if (keyboard.pressed('S')) {
    box.rotateX(-0.02);
  }

  if (keyboard.pressed('A')) {
    box.rotateY(0.02);
  }

  if (keyboard.pressed('D')) {
    box.rotateY(-0.02);
  }
}

render();
function render() {
  requestAnimationFrame(render);
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}