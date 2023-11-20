import * as THREE from 'three';
import { RaytracingRenderer } from '../../libs/other/raytracingRenderer.js';

var scene, renderer;

var container = document.createElement('div');
document.body.appendChild(container);

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the
// objects in the negative side
var camera = new THREE.PerspectiveCamera(60, 2 / 1, 1, 1000);
camera.position.z = 6;
camera.position.y = 2.5;

// light
var intensity = 0.5;
var light = new THREE.PointLight(0xffffff, intensity);
light.position.set(0, 2.50, 5);
scene.add(light);

var light = new THREE.PointLight(0x55aaff, intensity);
light.position.set(-1.00, 1.50, 4.00);
scene.add(light);

var light = new THREE.PointLight(0xffffff, intensity);
light.position.set(1.00, 1.50, 4.00);
scene.add(light);

renderer = new RaytracingRenderer(window.innerHeight * 2, window.innerHeight, 32, camera);
container.appendChild(renderer.domElement);

// materials
var phongMaterialBox = new THREE.MeshLambertMaterial({
    color: "rgb(255,255,255)",
});

var phongMaterialBoxBottom = new THREE.MeshLambertMaterial({
    color: "rgb(180,180,180)",
});

var phongMaterialBoxLeft = new THREE.MeshLambertMaterial({
    color: "rgb(200,0,0)",
});

var phongMaterialBoxRight = new THREE.MeshLambertMaterial({
    color: "rgb(0,200,0)",
});

var phongMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(150,190,220)",
    specular: "rgb(255,255,255)",
    shininess: 1000,
});

var mirrorMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(0,0,0)",
    specular: "rgb(255,255,255)",
    shininess: 1000,
});
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1;

var mirrorMaterialDark = new THREE.MeshPhongMaterial({
    color: "rgb(0,0,0)",
    specular: "rgb(170,170,170)",
    shininess: 10000,
});
mirrorMaterialDark.mirror = true;
mirrorMaterialDark.reflectivity = 1;

var mirrorMaterialSmooth = new THREE.MeshPhongMaterial({
    color: "rgb(255,170,0)",
    specular: "rgb(34,34,34)",
    shininess: 10000,
});
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

var glassMaterialSmooth = new THREE.MeshPhongMaterial({
    color: "rgb(0,0,0)",
    specular: "rgb(255,255,255)",
    shininess: 10000,
});
glassMaterialSmooth.glass = true;
glassMaterialSmooth.reflectivity = 0.25;
glassMaterialSmooth.refractionRatio = 1.5;

const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 10, 10);
const cylinder1 = new THREE.Mesh(cylinderGeometry, phongMaterial);
cylinder1.position.x = -4;
cylinder1.position.z = -2;
scene.add(cylinder1);

const cylinder2 = new THREE.Mesh(cylinderGeometry, phongMaterial);
cylinder2.position.x = 4;
cylinder2.position.z = -2;
scene.add(cylinder2);

const cylinder3 = new THREE.Mesh(cylinderGeometry, phongMaterial);
cylinder3.position.z = -3;
scene.add(cylinder3);

const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16); 
const torusMaterial = new THREE.MeshPhongMaterial({
    color: "yellow",
    specular: "rgb(255,255,255)",
    shininess: 1000,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.x = -3;
torus.position.y = 2.5;
scene.add(torus);

const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);
const glass = new THREE.Mesh(sphereGeometry, mirrorMaterial);
glass.scale.multiplyScalar(0.5);
glass.position.y = 2;
glass.position.z = -3;
scene.add( glass );

var planeGeometry = new THREE.BoxGeometry(20.00, 0.05, 12.00);

// bottom
var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxBottom);
plane.position.set(0, -1.5, -3.00);
scene.add(plane);

// top
var plane = new THREE.Mesh(planeGeometry, phongMaterialBox);
plane.position.set(0, 6, -4.00);
scene.add(plane);

// back
var plane = new THREE.Mesh(planeGeometry, phongMaterialBox);
plane.rotation.x = 1.57;
plane.position.set(0, 2.50, -8.00);
scene.add(plane);

// left
var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxLeft);
plane.rotation.z = 1.57;
plane.position.set(-7.00, 2.50, -3.00)
scene.add(plane);

// right
var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxRight);
plane.rotation.z = 1.57;
plane.position.set(7.00, 2.50, -3.00)
scene.add(plane);

render();

function render() {
    renderer.render(scene, camera);
}
