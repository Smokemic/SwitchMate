import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1a); // Tiefes Nachtblau
scene.fog = new THREE.Fog(0x0a0f1a, 10, 30);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 8);
camera.lookAt(2, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Schatten für mehr Tiefe
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Einfache Steuerung (optional, kann man auch weglassen)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enableZoom = true;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2.2;
controls.target.set(2, 1, 0);

// Licht
// Umgebungslicht
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

// Hauptlicht (Mondlicht von oben)
const moonLight = new THREE.DirectionalLight(0x8899aa, 0.5);
moonLight.position.set(5, 10, 5);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 1024;
moonLight.shadow.mapSize.height = 1024;
const d = 10;
moonLight.shadow.camera.left = -d;
moonLight.shadow.camera.right = d;
moonLight.shadow.camera.top = d;
moonLight.shadow.camera.bottom = -d;
moonLight.shadow.camera.near = 2;
moonLight.shadow.camera.far = 20;
scene.add(moonLight);

// Feuerlicht (dynamisch)
const fireLight = new THREE.PointLight(0xff6600, 2, 10);
fireLight.position.set(2, 1.2, 0);
fireLight.castShadow = true;
scene.add(fireLight);

// Zweites Licht für die Glut
const emberLight = new THREE.PointLight(0xff3300, 1, 8);
emberLight.position.set(1.8, 0.8, 0.2);
scene.add(emberLight);

// Boden
const groundGeometry = new THREE.CircleGeometry(15, 32);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2a3a2a,
    roughness: 0.8,
    metalness: 0.1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.receiveShadow = true;
scene.add(ground);

// Waldboden-Details (ein paar Grashalme/Steine)
for (let i = 0; i < 50; i++) {
    const rockGeo = new THREE.DodecahedronGeometry(0.05 + Math.random() * 0.1);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x445566, roughness: 0.9 });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 5;
    rock.position.x = 2 + Math.cos(angle) * radius;
    rock.position.z = Math.sin(angle) * radius;
    rock.position.y = 0;
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
}

// Bäume im Hintergrund (einfache Kegel)
for (let i = 0; i < 20; i++) {
    const treeGroup = new THREE.Group();
    
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    const foliageGeo = new THREE.ConeGeometry(0.6, 1.2, 8);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2a5a2a });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 1.5;
    foliage.castShadow = true;
    foliage.receiveShadow = true;
    treeGroup.add(foliage);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * 5;
    treeGroup.position.x = 2 + Math.cos(angle) * radius;
    treeGroup.position.z = Math.sin(angle) * radius;
    treeGroup.position.y = 0;
    
    scene.add(treeGroup);
}

// === LAGERFEUER ===
const fireGroup = new THREE.Group();
fireGroup.position.set(2, 0, 0);

// Holzstücke
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });

// Erstes Holz (unten)
const wood1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.4), woodMaterial);
wood1.position.y = 0.2;
wood1.rotation.z = 0.1;
wood1.rotation.x = 0.2;
wood1.castShadow = true;
wood1.receiveShadow = true;
fireGroup.add(wood1);

// Zweites Holz (quer)
const wood2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.4), woodMaterial);
wood2.position.y = 0.3;
wood2.rotation.y = Math.PI / 2.5;
wood2.rotation.x = 0.2;
wood2.rotation.z = 0.1;
wood2.castShadow = true;
wood2.receiveShadow = true;
fireGroup.add(wood2);

// Drittes Holz (oben)
const wood3 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 0.4), woodMaterial);
wood3.position.y = 0.5;
wood3.rotation.y = 1.2;
wood3.rotation.x = -0.1;
wood3.rotation.z = 0.2;
wood3.castShadow = true;
wood3.receiveShadow = true;
fireGroup.add(wood3);

// Kleine Holzscheite drumrum
for (let i = 0; i < 5; i++) {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), woodMaterial);
    stick.position.y = 0.1;
    stick.rotation.z = Math.random() * 0.5;
    stick.rotation.x = Math.random() * 0.5;
    stick.rotation.y = Math.random() * Math.PI * 2;
    stick.position.x = Math.cos(i * 1.2) * 0.8;
    stick.position.z = Math.sin(i * 1.2) * 0.8;
    stick.castShadow = true;
    stick.receiveShadow = true;
    fireGroup.add(stick);
}

scene.add(fireGroup);

// === FLAMMEN (einfache Kegel) ===
const flames = [];
const flameColors = [0xffaa00, 0xff6600, 0xff3300, 0xff2200];

for (let i = 0; i < 8; i++) {
    const height = 0.6 + Math.random() * 0.4;
    const flameGeo = new THREE.ConeGeometry(0.3 + Math.random()*0.1, height, 8);
    const flameMat = new THREE.MeshStandardMaterial({ 
        color: flameColors[Math.floor(Math.random() * flameColors.length)],
        emissive: 0xff4400,
        transparent: true,
        opacity: 0.8
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.8 + Math.random() * 0.3;
    flame.position.x = (Math.random() - 0.5) * 0.4;
    flame.position.z = (Math.random() - 0.5) * 0.3;
    flame.rotation.y = Math.random() * Math.PI;
    flame.castShadow = true;
    fireGroup.add(flame);
    flames.push({
        mesh: flame,
        baseY: flame.position.y,
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
    });
}

// === FUNKEN (Partikel) ===
const sparkCount = 100;
const sparks = [];
const sparkGeo = new THREE.BufferGeometry();
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkColors = new Float32Array(sparkCount * 3);

for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i*3] = 2 + (Math.random() - 0.5) * 1.5;
    sparkPositions[i*3+1] = 0.5 + Math.random() * 2;
    sparkPositions[i*3+2] = (Math.random() - 0.5) * 1.5;
    
    sparkColors[i*3] = 1;
    sparkColors[i*3+1] = 0.5 + Math.random() * 0.5;
    sparkColors[i*3+2] = 0;
}

sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

const sparkMat = new THREE.PointsMaterial({ 
    size: 0.05, 
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const sparkSystem = new THREE.Points(sparkGeo, sparkMat);
scene.add(sparkSystem);

// === BAZZI (Roboter) ===
const bazziGroup = new THREE.Group();
bazziGroup.position.set(4, 0.5, 2);
bazziGroup.rotation.y = -0.5;

// Körper
const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a6a8a, emissive: 0x112233 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.6;
body.castShadow = true;
body.receiveShadow = true;
bazziGroup.add(body);

// Kopf
const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
const headMat = new THREE.MeshStandardMaterial({ color: 0x6a8aaa, emissive: 0x112233 });
const head = new THREE.Mesh(headGeo, headMat);
head.position.y = 1.5;
head.castShadow = true;
head.receiveShadow = true;
bazziGroup.add(head);

// Augen
const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x88aaff });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.2, 1.65, 0.4);
bazziGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.2, 1.65, 0.4);
bazziGroup.add(rightEye);

// Pupillen
const pupilGeo = new THREE.SphereGeometry(0.07, 6, 6);
const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
leftPupil.position.set(-0.2, 1.63, 0.52);
bazziGroup.add(leftPupil);

const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
rightPupil.position.set(0.2, 1.63, 0.52);
bazziGroup.add(rightPupil);

// Antenne
const antennaGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
const antennaMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 });
const antenna = new THREE.Mesh(antennaGeo, antennaMat);
antenna.position.set(0, 2.0, 0);
antenna.rotation.x = 0.2;
bazziGroup.add(antenna);

const antennaBallGeo = new THREE.SphereGeometry(0.1, 6, 6);
const antennaBallMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0x442200 });
const antennaBall = new THREE.Mesh(antennaBallGeo, antennaBallMat);
antennaBall.position.set(0, 2.2, 0.05);
bazziGroup.add(antennaBall);

// Arme
const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
const armMat = new THREE.MeshStandardMaterial({ color: 0x3a5a7a });

const leftArm = new THREE.Mesh(armGeo, armMat);
leftArm.position.set(-0.7, 1.2, 0);
leftArm.rotation.z = 0.3;
leftArm.castShadow = true;
bazziGroup.add(leftArm);

const rightArm = new THREE.Mesh(armGeo, armMat);
rightArm.position.set(0.7, 1.2, 0);
rightArm.rotation.z = -0.3;
rightArm.castShadow = true;
bazziGroup.add(rightArm);

// Basis (Füße)
const footGeo = new THREE.BoxGeometry(0.4, 0.2, 0.6);
const footMat = new THREE.MeshStandardMaterial({ color: 0x2a3a4a });

const leftFoot = new THREE.Mesh(footGeo, footMat);
leftFoot.position.set(-0.3, 0.1, 0);
leftFoot.castShadow = true;
leftFoot.receiveShadow = true;
bazziGroup.add(leftFoot);

const rightFoot = new THREE.Mesh(footGeo, footMat);
rightFoot.position.set(0.3, 0.1, 0);
rightFoot.castShadow = true;
rightFoot.receiveShadow = true;
bazziGroup.add(rightFoot);

scene.add(bazziGroup);

// === STERNE ===
const starsGeo = new THREE.BufferGeometry();
const starsCount = 300;
const starsPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i++) {
    const r = 30 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starsPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
    starsPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    starsPositions[i*3+2] = r * Math.cos(phi);
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

// === ANIMATION ===
let clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();
    const time = performance.now() / 1000;
    
    // Feuer flackern
    flames.forEach(flame => {
        flame.mesh.scale.y = 0.8 + Math.sin(time * flame.speed * 10 + flame.offset) * 0.3;
        flame.mesh.position.y = flame.baseY + Math.sin(time * flame.speed * 8 + flame.offset) * 0.1;
        flame.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * 5 + flame.offset) * 0.3;
    });
    
    // Licht flackern
    fireLight.intensity = 1.5 + Math.sin(time * 20) * 0.5;
    emberLight.intensity = 0.5 + Math.sin(time * 25) * 0.3;
    
    // Funken bewegen
    const positions = sparkSystem.geometry.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
        // Nach oben steigen
        positions[i*3+1] += 0.01 + Math.random() * 0.02;
        
        // Leicht zur Seite driften
        positions[i*3] += (Math.random() - 0.5) * 0.02;
        positions[i*3+2] += (Math.random() - 0.5) * 0.02;
        
        // Zurücksetzen wenn zu hoch
        if (positions[i*3+1] > 3.5) {
            positions[i*3] = 2 + (Math.random() - 0.5) * 1.2;
            positions[i*3+1] = 0.5;
            positions[i*3+2] = (Math.random() - 0.5) * 1.2;
        }
    }
    sparkSystem.geometry.attributes.position.needsUpdate = true;
    
    // Bazzi leicht wippen
    bazziGroup.position.y = 0.5 + Math.sin(time * 2) * 0.03;
    bazziGroup.rotation.y = -0.5 + Math.sin(time * 1.5) * 0.1;
    
    // Kopf leicht bewegen
    head.rotation.x = Math.sin(time * 1.2) * 0.1;
    head.rotation.y = Math.sin(time * 0.8) * 0.1;
    
    // Steuerung aktualisieren
    controls.update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Fenstergröße anpassen
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
