import * as THREE from '/node_modules/three/build/three.module.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js';

export class ModelController {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.model = null;
        this.meshes = new Map();
        this.selectedPart = null;
        this.rotationAnimation = null;
        this.rotationClip = null;

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // 添加方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    async loadModel(url) {
        console.log('Attempting to load model from:', url);
        const loader = new GLTFLoader();
        
        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (gltf) => {
                    console.log('Model loaded successfully');
                    this.model = gltf.scene;
                    
                    // 调试：打印模型信息
                    console.log('Model structure:', this.model);
                    this.model.traverse((node) => {
                        if (node.isMesh) {
                            console.log('Mesh found:', {
                                name: node.name,
                                materialCount: Array.isArray(node.material) ? node.material.length : 1,
                                materials: Array.isArray(node.material) ? 
                                    node.material.map(m => ({
                                        name: m.name,
                                        color: m.color ? m.color.getHexString() : 'none',
                                        map: m.map ? 'yes' : 'no'
                                    })) : 
                                    [{
                                        name: node.material.name,
                                        color: node.material.color ? node.material.color.getHexString() : 'none',
                                        map: node.material.map ? 'yes' : 'no'
                                    }]
                            });
                        }
                    });

                    // 设置模型位置和缩放
                    this.model.position.set(0, -0.8, 0);
                    this.model.scale.set(0.0125, 0.0125, 0.0125);

                    // 递归处理所有节点
                    this.processNode(this.model);

                    this.scene.add(this.model);

                    // 添加旋转动画
                    this.addRotationAnimation();
                    resolve(this.model);
                },
                (xhr) => {
                    console.log('Loading progress:', (xhr.loaded / xhr.total * 100) + '%');
                },
                (error) => {
                    console.error('Error loading model:', error);
                    reject(error);
                }
            );
        });
    }

    processNode(node, level = 0, parentName = 'root') {
        const indent = '  '.repeat(level);
        console.log(`${indent}Node: ${node.name || 'unnamed'} (Parent: ${parentName})`);
        
        if (node.isMesh) {
            console.log(`${indent}└─ Mesh Details:`);
            console.log(`${indent}   ├─ UUID: ${node.uuid}`);
            console.log(`${indent}   ├─ Material Count: ${Array.isArray(node.material) ? node.material.length : 1}`);
            console.log(`${indent}   └─ Geometry Vertices: ${node.geometry.attributes.position.count}`);

            // 为每个网格创建独立的材质
            if (Array.isArray(node.material)) {
                node.material = node.material.map(mat => {
                    const newMat = mat.clone();
                    // 保存并使用原始颜色和属性
                    const originalColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
                    const originalEmissive = mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000);
                    
                    // 保存到userData
                    newMat.userData = {
                        originalColor: originalColor,
                        originalEmissive: originalEmissive
                    };

                    // 直接使用原始颜色
                    newMat.color = originalColor;
                    newMat.emissive = originalEmissive;
                    
                    // 设置其他材质属性
                    newMat.metalness = 0.3;
                    newMat.roughness = 0.7;

                    // 如果是Body节点，设置半透明
                    if (node.name === 'Body' || parentName === 'Body') {
                        newMat.transparent = true;
                        newMat.opacity = 0.5;
                        newMat.side = THREE.DoubleSide;  // 双面渲染
                        // 设置为浅肤色
                        newMat.color = new THREE.Color(0xffe0bd);
                    } else {
                        newMat.transparent = false;
                        newMat.opacity = 1.0;
                    }

                    return newMat;
                });
            } else {
                const originalMat = node.material;
                const newMat = originalMat.clone();
                
                // 保存并使用原始颜色和属性
                const originalColor = originalMat.color ? originalMat.color.clone() : new THREE.Color(0xffffff);
                const originalEmissive = originalMat.emissive ? originalMat.emissive.clone() : new THREE.Color(0x000000);
                
                // 保存到userData
                newMat.userData = {
                    originalColor: originalColor,
                    originalEmissive: originalEmissive
                };

                // 直接使用原始颜色
                newMat.color = originalColor;
                newMat.emissive = originalEmissive;
                
                // 设置其他材质属性
                newMat.metalness = 0.3;
                newMat.roughness = 0.7;

                // 如果是Body节点，设置半透明
                if (node.name === 'Body' || parentName === 'Body') {
                    newMat.transparent = true;
                    newMat.opacity = 0.5;
                    newMat.side = THREE.DoubleSide;  // 双面渲染
                    // 设置为浅肤色
                    newMat.color = new THREE.Color(0xffe0bd);
                } else {
                    newMat.transparent = false;
                    newMat.opacity = 1.0;
                }

                node.material = newMat;
            }

            // 存储网格和材质信息
            this.meshes.set(node.uuid, {
                mesh: node,
                materials: Array.isArray(node.material) ? node.material : [node.material]
            });

            // 设置基本属性
            node.frustumCulled = false;
            node.castShadow = true;
            node.receiveShadow = true;

            // 打印材质信息
            console.log(`${indent}   Materials:`);
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((mat, index) => {
                console.log(`${indent}   ├─ Material ${index}:`);
                console.log(`${indent}   │  ├─ Color: ${mat.color.getHexString()}`);
                console.log(`${indent}   │  ├─ Emissive: ${mat.emissive.getHexString()}`);
                console.log(`${indent}   │  ├─ Metalness: ${mat.metalness}`);
                console.log(`${indent}   │  ├─ Roughness: ${mat.roughness}`);
                console.log(`${indent}   │  ├─ Transparent: ${mat.transparent}`);
                console.log(`${indent}   │  └─ Opacity: ${mat.opacity}`);
            });
        }

        // 递归处理子节点
        node.children.forEach(child => {
            this.processNode(child, level + 1, node.name || 'unnamed');
        });
    }

    addRotationAnimation() {
        if (!this.model) return;

        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(this.model);
        this.rotationAnimation = mixer;

        // 创建一个完整旋转的关键帧轨道
        const times = [0, 15];  // 15秒一圈
        const values = [0, Math.PI * 2];  // 旋转一圈

        const rotationTrack = new THREE.NumberKeyframeTrack(
            '.rotation[y]',  // 要修改的属性
            times,           // 关键帧时间
            values          // 关键帧值
        );

        // 创建动画剪辑
        this.rotationClip = new THREE.AnimationClip('rotate', -1, [rotationTrack]);

        // 播放动画
        const action = mixer.clipAction(this.rotationClip);
        action.setLoop(THREE.LoopRepeat);
        action.play();

        // 更新动画
        const clock = new THREE.Clock();
        const animate = () => {
            if (mixer) {
                const delta = clock.getDelta();
                mixer.update(delta);
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    startRotation() {
        if (this.rotationAnimation) {
            const action = this.rotationAnimation.clipAction(this.rotationClip);
            // 从当前位置继续旋转
            action.reset();
            action.play();
        } else {
            this.addRotationAnimation();
        }
    }

    stopRotation() {
        if (this.rotationAnimation) {
            const action = this.rotationAnimation.clipAction(this.rotationClip);
            // 使用stop而不是pause，这样动画会保持在当前位置
            action.stop();
        }
    }

    handleClick(raycaster) {
        if (!this.model) return;

        const intersects = raycaster.intersectObject(this.model, true);
        for (const intersect of intersects) {
            const clickedObject = intersect.object;
            
            // 确保点击的是网格且在我们的可点击列表中，并且不是Body节点
            if (!clickedObject.isMesh || 
                !this.meshes.has(clickedObject.uuid) || 
                clickedObject.name === 'Body') {
                continue;
            }

            const meshData = this.meshes.get(clickedObject.uuid);
            console.log('Clicked mesh:', {
                name: clickedObject.name,
                uuid: clickedObject.uuid,
                parent: clickedObject.parent ? clickedObject.parent.name : 'no parent'
            });

            // 如果点击了同一个部位，取消高亮并恢复旋转
            if (this.selectedPart === clickedObject) {
                this.restoreOriginalMaterial(clickedObject);
                this.selectedPart = null;
                // 恢复旋转动画
                this.startRotation();
            } else {
                // 恢复之前选中部位的材质
                if (this.selectedPart) {
                    this.restoreOriginalMaterial(this.selectedPart);
                }
                
                this.highlightMesh(clickedObject);
                this.selectedPart = clickedObject;
                // 停止旋转动画
                this.stopRotation();
            }
            
            break;
        }
    }

    highlightMesh(mesh) {
        if (!mesh.isMesh || !this.meshes.has(mesh.uuid)) return;

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach(material => {
            // 保存原始材质属性
            material.userData.originalColor = material.color.clone();
            material.userData.originalEmissive = material.emissive.clone();
            material.userData.originalEmissiveIntensity = material.emissiveIntensity;
            
            // 设置淡红色高亮效果
            material.emissive.setHex(0xff0000);  // 红色
            material.emissiveIntensity = 0.5;    // 较低的强度使其显得柔和
        });
        
        console.log('Highlighting mesh:', mesh.name);
    }

    restoreOriginalMaterial(mesh) {
        if (!mesh.isMesh || !this.meshes.has(mesh.uuid)) return;

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach(material => {
            if (material.userData.originalColor) {
                // 恢复原始颜色和发光属性
                material.color.copy(material.userData.originalColor);
                material.emissive.copy(material.userData.originalEmissive);
                material.emissiveIntensity = material.userData.originalEmissiveIntensity || 0;
                
                // 清除保存的原始值
                delete material.userData.originalColor;
                delete material.userData.originalEmissive;
                delete material.userData.originalEmissiveIntensity;
            }
        });
        
        console.log('Restored original material for mesh:', mesh.name);
    }
}
