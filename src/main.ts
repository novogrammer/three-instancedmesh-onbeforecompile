import './style.scss'
import * as THREE from "three";
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {OrbitControls} from "three/addons/controls/OrbitControls.js"

const appElement=document.querySelector<HTMLDivElement>('#app')!;
appElement.innerHTML = `
<canvas id="renderCanvas"></canvas>
`;


interface Size{
  width:number;
  height:number;
};

function getSize():Size{
  const width=appElement.clientWidth;
  const height=appElement.clientHeight;
  return {
    width,
    height,
  }
}


const renderCanvasElement=document.querySelector<HTMLCanvasElement>("#renderCanvas")!;


const scene = new THREE.Scene();
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync( 'textures/equirectangular/blouberg_sunrise_2_1k.hdr' ).then((envMap:THREE.Texture)=>{
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  const skybox=new GroundProjectedSkybox(envMap);
  skybox.scale.setScalar(100);
  skybox.name="Skybox";
  scene.add(skybox);
  scene.environment=envMap;
});

const size=getSize()
const camera = new THREE.PerspectiveCamera( 75, size.width / size.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas:renderCanvasElement,
});

camera.position.y = 2;
camera.position.z = 3;

const orbitControls=new OrbitControls(camera,renderer.domElement);
orbitControls.target.set( 0, 2, 0 );
// orbitControls.autoRotate=true;
orbitControls.update();


{
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
    metalness:0,
    roughness:0,
    ior:1.7,
    transmission:0.75,
    thickness:0.2,
  });
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.position.y=1;
}



function onResize(){
  const size=getSize();
  camera.aspect=size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width,size.height);
}
window.addEventListener("resize",onResize);
onResize();


function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
  // orbitControls.update();
	renderer.render( scene, camera );
}

animate();
