import { SceneManager } from './SceneManager.js';
import { ModelController } from './ModelController.js';
import * as THREE from 'three';

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
        try {
            const modelPath = '/models/ren.glb';
            console.log('Loading model from path:', modelPath);
            await this.modelController.loadModel(modelPath);
            this.setupEventListeners();
            this.animate();
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
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
        this.modelController.update();  // 更新模型控制器
        this.sceneManager.update();     // 更新场景
    }
}

new App();
