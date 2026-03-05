import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1a2a); // Dunkelblau für Nacht
scene.fog = new THREE.Fog(0x0a1a2a, 10, 30); // Leichter Nebel

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Schatten für Atmosphäre
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

// Feuerlicht (dynamisch)
const fireLight = new THREE.PointLight(0xff6600, 1.5, 15);
fireLight.position.set(0, 1.5, 0);
fireLight.castShadow = true;
fireLight.shadow.mapSize.width = 512;
fireLight.shadow.mapSize.height = 512;
scene.add(fireLight);

// Zusätzliches warmes Licht von der Seite
const warmLight = new THREE.PointLight(0xffaa44, 0.8, 12);
warmLight.position.set(-2, 2, 2);
scene.add(warmLight);

// Boden
const groundGeometry = new THREE.CircleGeometry(8, 32);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1e0f, roughness: 0.8, metalness: 0.1 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

// Lagerfeuerstelle (Steine)
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 });
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const stone = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.15 + Math.random()*0.1),
        stoneMaterial
    );
    stone.position.set(Math.cos(angle)*0.8, 0.05, Math.sin(angle)*0.8);
    stone.scale.set(1, 0.5 + Math.random()*0.5, 1);
    stone.castShadow = true;
    stone.receiveShadow = true;
    scene.add(stone);
}

// Holzstücke
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
for (let i = 0; i < 4; i++) {
    const wood = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.8),
        woodMaterial
    );
    wood.rotation.z = Math.PI / 2 + (i * 0.5);
    wood.rotation.x = Math.PI / 2;
    wood.position.set(Math.sin(i)*0.4, 0.2, Math.cos(i)*0.4);
    wood.castShadow = true;
    wood.receiveShadow = true;
    scene.add(wood);
}

// === FEUER (Partikel) ===
const fireParticles = [];
const fireCount = 40;
const fireGeometry = new THREE.BufferGeometry();
const firePositions = new Float32Array(fireCount * 3);
const fireColors = new Float32Array(fireCount * 3);

for (let i = 0; i < fireCount; i++) {
    firePositions[i*3] = (Math.random() - 0.5) * 0.5;
    firePositions[i*3+1] = Math.random() * 0.5;
    firePositions[i*3+2] = (Math.random() - 0.5) * 0.5;
    
    const color = new THREE.Color().lerpColors(
        new THREE.Color(0xffaa00),
        new THREE.Color(0xff3300),
        Math.random()
    );
    fireColors[i*3] = color.r;
    fireColors[i*3+1] = color.g;
    fireColors[i*3+2] = color.b;
}

fireGeometry.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
fireGeometry.setAttribute('color', new THREE.BufferAttribute(fireColors, 3));

const fireMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
});

const fire = new THREE.Points(fireGeometry, fireMaterial);
fire.position.set(0, 0.3, 0);
scene.add(fire);

// Funken (zusätzliche Partikel)
const sparkCount = 30;
const sparkGeometry = new THREE.BufferGeometry();
const sparkPositions = new Float32Array(sparkCount * 3);
for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i*3] = (Math.random() - 0.5) * 0.8;
    sparkPositions[i*3+1] = Math.random() * 0.8;
    sparkPositions[i*3+2] = (Math.random() - 0.5) * 0.8;
}
sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

const sparkMaterial = new THREE.PointsMaterial({
    color: 0xffaa44,
    size: 0.05,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
sparks.position.set(0, 0.3, 0);
scene.add(sparks);

// === BAZZI (einfacher Roboter) ===
const bazziGroup = new THREE.Group();

// Körper (leicht abgerundet)
const bodyGeo = new THREE.CylinderGeometry(0.6, 0.7, 1.2, 8);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, emissive: 0x112233, roughness: 0.4, metalness: 0.6 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.6;
body.castShadow = true;
body.receiveShadow = true;
bazziGroup.add(body);

// Kopf
const headGeo = new THREE.SphereGeometry(0.4, 16);
const headMat = new THREE.MeshStandardMaterial({ color: 0x6ba5ff, emissive: 0x112233, roughness: 0.3, metalness: 0.5 });
const head = new THREE.Mesh(headGeo, headMat);
head.position.y = 1.4;
head.castShadow = true;
head.receiveShadow = true;
bazziGroup.add(head);

// Augen (leuchtend)
const eyeGeo = new THREE.SphereGeometry(0.12, 8);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.15, 1.5, 0.35);
leftEye.castShadow = true;
bazziGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.15, 1.5, 0.35);
rightEye.castShadow = true;
bazziGroup.add(rightEye);

// Antenne
const antennaGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
const antennaMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x331100 });
const antenna = new THREE.Mesh(antennaGeo, antennaMat);
antenna.position.set(0, 1.8, 0);
antenna.castShadow = true;
bazziGroup.add(antenna);

const antennaBall = new THREE.SphereGeometry(0.1, 6);
const antennaBallMesh = new THREE.Mesh(antennaBall, antennaMat);
antennaBallMesh.position.set(0, 1.95, 0);
antennaBallMesh.castShadow = true;
bazziGroup.add(antennaBallMesh);

// Arme
const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7);
const armMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.5 });

const leftArm = new THREE.Mesh(armGeo, armMat);
leftArm.position.set(-0.6, 0.9, 0);
leftArm.rotation.z = 0.3;
leftArm.castShadow = true;
bazziGroup.add(leftArm);

const rightArm = new THREE.Mesh(armGeo, armMat);
rightArm.position.set(0.6, 0.9, 0);
rightArm.rotation.z = -0.3;
rightArm.castShadow = true;
bazziGroup.add(rightArm);

// Bazzi positionieren
bazziGroup.position.set(2.0, 0, 1.5);
bazziGroup.rotation.y = -0.5;
scene.add(bazziGroup);

// Bäume/Umgebung (ein paar einfache)
function createTree(x, z) {
    const treeGroup = new THREE.Group();
    
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    const leafGeo = new THREE.ConeGeometry(0.8, 1.2, 6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
    const leaves = new THREE.Mesh(leafGeo, leafMat);
    leaves.position.y = 2;
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    treeGroup.add(leaves);
    
    treeGroup.position.set(x, 0, z);
    return treeGroup;
}

scene.add(createTree(-4, -3));
scene.add(createTree(4, -3));
scene.add(createTree(-3, 4));
scene.add(createTree(3, 4));

// Sterne (ein paar)
const starsGeo = new THREE.BufferGeometry();
const starsPos = [];
for (let i = 0; i < 100; i++) {
    starsPos.push((Math.random() - 0.5) * 50);
    starsPos.push((Math.random() - 0.5) * 20 + 10);
    starsPos.push((Math.random() - 0.5) * 50);
}
starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsPos, 3));
const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

// === ANIMATION ===
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = performance.now() / 1000;
    
    // Feuer flackern
    fireLight.intensity = 1.2 + Math.sin(time * 20) * 0.3 + Math.sin(time * 37) * 0.2;
    
    // Feuer-Partikel bewegen
    const positions = fire.geometry.attributes.position.array;
    for (let i = 0; i < fireCount; i++) {
        // Aufsteigen
        positions[i*3+1] += delta * 0.5;
        
        // Leichtes Zittern
        positions[i*3] += Math.sin(time + i) * delta * 0.1;
        positions[i*3+2] += Math.cos(time + i) * delta * 0.1;
        
        // Zurücksetzen wenn zu hoch
        if (positions[i*3+1] > 1.0) {
            positions[i*3] = (Math.random() - 0.5) * 0.5;
            positions[i*3+1] = 0;
            positions[i*3+2] = (Math.random() - 0.5) * 0.5;
        }
    }
    fire.geometry.attributes.position.needsUpdate = true;
    
    // Funken
    const sparkPos = sparks.geometry.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
        sparkPos[i*3+1] += delta * 0.8;
        if (sparkPos[i*3+1] > 1.2) {
            sparkPos[i*3] = (Math.random() - 0.5) * 0.8;
            sparkPos[i*3+1] = 0;
            sparkPos[i*3+2] = (Math.random() - 0.5) * 0.8;
        }
    }
    sparks.geometry.attributes.position.needsUpdate = true;
    
    // Bazzi wippt sanft
    bazziGroup.position.y = Math.sin(time * 2) * 0.03;
    bazziGroup.rotation.y += 0.002;
    
    // Augen leuchten leicht
    const eyeIntensity = 0.5 + Math.sin(time * 5) * 0.2;
    leftEye.material.emissiveIntensity = eyeIntensity;
    rightEye.material.emissiveIntensity = eyeIntensity;
    
    renderer.render(scene, camera);
}

animate();

// Fenstergröße anpassen
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
