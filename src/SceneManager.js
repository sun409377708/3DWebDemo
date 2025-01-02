import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
    constructor(container) {
        this.container = container;
        this.setup();
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createControls();
        this.handleResize();
    }

    setup() {
        this.scene = new THREE.Scene();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
    }

    createScene() {
        this.scene.background = new THREE.Color(0xf5f5f5);  // 使用浅白色背景
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 2);  
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);  
        directionalLight.position.set(2, 2, 2);  
        this.scene.add(directionalLight);

        // 添加背光
        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(-2, 2, -2);
        this.scene.add(backLight);
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    update() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
