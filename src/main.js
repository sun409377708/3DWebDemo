import { SceneManager } from './SceneManager';
import { ModelController } from './ModelController';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

class App {
    constructor() {
        this.container = document.getElementById('scene-container');
        this.sceneManager = new SceneManager(this.container);
        this.modelController = new ModelController(this.sceneManager.scene);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }

    async init() {
        await this.modelController.loadModel('/models/ren.glb');
        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        this.container.addEventListener('click', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
            this.modelController.handleClick(this.raycaster);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();
        this.sceneManager.update();
    }
}

new App();
