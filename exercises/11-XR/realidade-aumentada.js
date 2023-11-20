import * as THREE from 'three';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import { ARjs } from '../../libs/AR/ar.js';
import {
    initDefaultSpotlight,
    initRenderer,
    getFilename,
    getMaxSize
} from "../../libs/util/util.js";

// init scene and camera
let scene, camera, renderer, light;
const clock = new THREE.Clock();
renderer = initRenderer();
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
scene = new THREE.Scene();
camera = new THREE.Camera();
scene.add(camera);
light = initDefaultSpotlight(scene, new THREE.Vector3(25, 30, 20)); // Use default light

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'rgb(100, 100, 100)',
    transparent: true,
    opacity: 0.3
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

const spotlightPosition = new THREE.Vector3(-5.0, 5.0, 0);
const spotlight = new THREE.SpotLight('rgb(255,255,255)');
spotlight.position.copy(spotlightPosition);
spotlight.angle = THREE.MathUtils.degToRad(30);
spotlight.target.updateMatrixWorld();
spotlight.castShadow = true;
spotlight.shadow.bias = -0.0005;

spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;

spotlight.shadow.camera.near = 0.1;
spotlight.shadow.camera.far = 1000;
spotlight.shadow.camera.fov = 30;

scene.add(spotlight);

const mixer = [];

// Set AR Stuff
let AR = {
    source: null,
    context: null,
}
setARStuff();

window.addEventListener('resize', function () { onResize() });

//----------------------------------------------------------------------------
const assetManager = {
    // Properties ---------------------------------
    dog: null,
    allLoaded: false,

    // Functions ----------------------------------
    checkLoaded: function () {
        if (!this.allLoaded) {
            if (this.dog) {
                this.allLoaded = true;
                loadingMessage.hide();
            }
        }
    },

    hideAll: function () {
        this.dog.visible = false;
    }
}

loadGLTFFile('../../assets/objects/', 'dog', 1.5, 0, true);

//----------------------------------------------------------------------------
render();

function render() {
    var delta = clock.getDelta(); // Get the seconds passed since the time 'oldTime' was set and sets 'oldTime' to the current time.
    updateAR();
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene

    for (var i = 0; i < mixer.length; i++)
        mixer[i].update(delta);
}

function updateAR() {
    if (AR.source) {
        if (AR.source.ready === false) return
        AR.context.update(AR.source.domElement)
        scene.visible = camera.visible
    }
}

function onResize() {
    AR.source.onResizeElement()
    AR.source.copyElementSizeTo(renderer.domElement)
    if (AR.context.arController !== null) {
        AR.source.copyElementSizeTo(AR.context.arController.canvas)
    }
}

function setARStuff() {
    //----------------------------------------------------------------------------
    // Handle arToolkitSource
    // More info: https://ar-js-org.github.io/AR.js-Docs/marker-based/
    AR.source = new ARjs.Source({
        // to read from a video
        sourceType: 'video',
        sourceUrl: '../../assets/AR/kanjiScene.mp4'

        // to read from the webcam
        //sourceType : 'webcam',

        // to read from an image
        // sourceType : 'image',
        // sourceUrl : '../assets/AR/kanjiScene.jpg',

    })

    AR.source.init(function onReady() {
        setTimeout(() => {
            onResize()
        }, 100);
    })

    //----------------------------------------------------------------------------
    // initialize arToolkitContext
    AR.context = new ARjs.Context({
        cameraParametersUrl: '../../libs/AR/data/camera_para.dat',
        detectionMode: 'mono',
    })

    // initialize it
    AR.context.init(function onCompleted() {
        camera.projectionMatrix.copy(AR.context.getProjectionMatrix());
    })

    //----------------------------------------------------------------------------
    // Create a ArMarkerControls
    let markerControls;
    markerControls = new ARjs.MarkerControls(AR.context, camera, {
        type: 'pattern',
        patternUrl: '../../libs/AR/data/patt.kanji',
        changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    })
    // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
    scene.visible = false
}

function loadGLTFFile(modelPath, modelName, desiredScale, angle, visibility) {
    var loader = new GLTFLoader();
    loader.load(modelPath + modelName + '.glb', function (gltf) {
        var obj = gltf.scene;
        obj.visible = visibility;
        obj.name = getFilename(modelName);
        obj.traverse(function (child) {
            if (child.isMesh) child.castShadow = true;
            if (child.material) child.material.side = THREE.DoubleSide;
        });

        var obj = normalizeAndRescale(obj, desiredScale);
        var obj = fixPosition(obj);
        obj.rotateY(THREE.MathUtils.degToRad(angle));

        scene.add(obj);
        assetManager[modelName] = obj;

        var mixerLocal = new THREE.AnimationMixer(obj);
        mixerLocal.clipAction(gltf.animations[0]).play();
        mixer.push(mixerLocal);
    }, onProgress, () => { });

    // Create animationMixer and push it in the array of mixers
}

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale) {
    var scale = getMaxSize(obj); // Available in 'utils.js'
    obj.scale.set(newScale * (1.0 / scale),
        newScale * (1.0 / scale),
        newScale * (1.0 / scale));
    return obj;
}

function fixPosition(obj) {
    // Fix position of the object over the ground plane
    var box = new THREE.Box3().setFromObject(obj);
    if (box.min.y > 0)
        obj.translateY(-box.min.y);
    else
        obj.translateY(-1 * box.min.y);
    return obj;
}