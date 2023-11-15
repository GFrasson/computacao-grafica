import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initCamera,
    onWindowResize,
    degreesToRadians
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const renderer = initRenderer();    // Init a basic renderer
const camera = initCamera(new THREE.Vector3(8, 10, 15)); // Init camera in this position
const orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

const ambientLight = new THREE.AmbientLight('rgb(80, 80, 80)');
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('rgb(255, 255, 255)', 1);
directionalLight.position.set(10, 10, 10);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 110;
directionalLight.shadow.camera.left = -45;
directionalLight.shadow.camera.right = 45;
directionalLight.shadow.camera.bottom = -40;
directionalLight.shadow.camera.top = 40;
directionalLight.shadow.bias = -0.0005;
directionalLight.shadow.radius = 1.0;

scene.add(directionalLight);

const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
const sphereMaterial = setMaterial(
    '../../assets/textures/displacement/rockWall.jpg',
    '../../assets/textures/displacement/rockWall_Normal.jpg',
    new THREE.Vector2(0.2, 0.2),
    '../../assets/textures/displacement/rockWall_Height.jpg',
    0.2,
    3,
    4
);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.y = 3;
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
const planeMaterial = setMaterial(
    '../../assets/textures/floorWood.jpg',
);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const mat4 = new THREE.Matrix4();
plane.matrixAutoUpdate = false;
plane.matrix.identity();
plane.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0, -0.1, 0.0));
plane.matrix.multiply(new THREE.Matrix4().makeRotationX(degreesToRadians(-90)));
plane.receiveShadow = true;
scene.add(plane);

function setMaterial(textureFile, normalMapFile = null, normalMapScale = null, displacementMapFile = null, displacementMapScale = null, repeatU = 1, repeatV = 1) {
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
        color: 'rgb(255, 255, 255)',
        map: textureLoader.load(textureFile),
        ...(normalMapFile && {
            normalMap: textureLoader.load(normalMapFile),
            normalScale: normalMapScale ?? new THREE.Vector2(1, 1)
        }),
        ...(displacementMapFile && {
            displacementMap: textureLoader.load(displacementMapFile),
            displacementScale: displacementMapScale ?? 1
        }),
    });

    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.minFilter = THREE.LinearFilter;
    material.map.magFilter = THREE.LinearFilter;
    material.map.repeat.set(repeatU, repeatV);

    if (normalMapFile) {
        material.normalMap.wrapS = THREE.RepeatWrapping;
        material.normalMap.wrapT = THREE.RepeatWrapping;
        material.normalMap.minFilter = THREE.LinearFilter;
        material.normalMap.magFilter = THREE.LinearFilter;
        material.normalMap.repeat.set(4, 3);
    }

    if (displacementMapFile) {
        material.displacementMap.wrapS = THREE.RepeatWrapping;
        material.displacementMap.wrapT = THREE.RepeatWrapping;
        material.displacementMap.minFilter = THREE.LinearFilter;
        material.displacementMap.magFilter = THREE.LinearFilter;
        material.displacementMap.repeat.set(4, 3);
    }

    return material;
}

render();
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}