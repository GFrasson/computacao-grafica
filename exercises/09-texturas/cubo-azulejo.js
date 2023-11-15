import * as THREE from 'three';
import Stats from '../../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultSpotlight,
    onWindowResize,
    lightFollowingCamera
} from "../../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const stats = new Stats();          // To show FPS information

const renderer = initRenderer();    // View function in util/utils
const camera = initCamera(new THREE.Vector3(10, 10, 10)); // Init camera in this position
const light = initDefaultSpotlight(scene, new THREE.Vector3(0, 0, 30)); // Use default light

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Enable mouse rotation, pan, zoom etc.
const trackballControls = new TrackballControls(camera, renderer.domElement);

// Show axes (parameter is size of each axis)
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// Create the cube
const textureLoader = new THREE.TextureLoader();
const geometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterials = [
    setMaterial(null, '../../assets/textures/tiles.jpg', 0.334, 0.334, 0.334, 0), //x+
    setMaterial(null, '../../assets/textures/tiles.jpg', 0.334, 0.334, 0.667, 0), //x-
    setMaterial(null, '../../assets/textures/tiles.jpg', 0.334, 0.334, 0, 0.334), //y+
    setMaterial(null, '../../assets/textures/tiles.jpg', 0.334, 0.334, 0, 0.667), //y-
    setMaterial(null, '../../assets/textures/tiles.jpg', 0.334, 0.334, 0.334, 0.334), //z+
    setMaterial(null, '../../assets/textures/tiles.jpg', 0.334, 0.334, 0.667, 0.667) //z-
];
const cube = new THREE.Mesh(geometry, cubeMaterials);
scene.add(cube);


// Function to set basic material or textures
// You can set just a color, just a texture or both
function setMaterial(color, file = null, repeatU = 1, repeatV = 1, offsetU = 0, offsetV = 0) {
    if (!color) color = 'rgb(23355,255,255)';

    let material;
    if (!file) {
        material = new THREE.MeshBasicMaterial({ color: color });
    } else {
        material = new THREE.MeshBasicMaterial({ map: textureLoader.load(file), color: color });
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.minFilter = THREE.LinearFilter;
        material.map.magFilter = THREE.LinearFilter;
        material.map.repeat.set(repeatU, repeatV);
        
        // material.map.offset.set(offsetU, offsetV);
        material.map.offset.x = offsetU;
        material.map.offset.y = offsetV;
    }

    return material;
}

(
    function render() {
        stats.update(); // Update FPS
        trackballControls.update();
        lightFollowingCamera(light, camera); // Makes light follow the camera
        requestAnimationFrame(render); // Show events
        renderer.render(scene, camera) // Render scene
    }
)();
