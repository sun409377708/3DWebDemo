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
        try {
            // 根据是否是生产环境决定模型路径
            const modelPath = import.meta.env.PROD ? '/3DWebDemo/models/ren.glb' : '/models/ren.glb';
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
        TWEEN.update();
        this.sceneManager.update();
    }
}

new App();
