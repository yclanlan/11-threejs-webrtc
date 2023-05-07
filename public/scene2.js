import * as THREE from "three";
import { FirstPersonControls } from "./libraries/firstPersonControls.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlakesTexture } from 'three/addons/textures/FlakesTexture.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

THREE.ColorManagement.enabled = false;
 // TODO: Confirm correct color management.




export class MyScene {

  constructor() {

    this.avatars = {};
 
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x64B4FD, 0.015 );

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.lookAt(-5 ,0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
   
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    // this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap; 

    document.body.appendChild( this.renderer.domElement);

    this.controls = new FirstPersonControls(
    this.scene,
    this.camera,
    this.renderer,
    );        

    this.renderScene = new RenderPass( this.scene, this.camera );

        //////////////////////////////////////////
				this.bloomPass = new UnrealBloomPass ( 
          new THREE.Vector2( window.innerWidth, window.innerHeight ), 
          2, //bloomStrength
          0, //bloomThreshold
          0 //bloomRadius
          );
        // this.bloomPass.threshold = params.bloomThreshold;
				// this.bloomPass.strength = params.bloomStrength;
				// this.bloomPass.radius = params.bloomRadius;

          
				this.bloomComposer = new EffectComposer( this.renderer );
				this.bloomComposer.addPass( this.renderScene );
				this.bloomComposer.addPass( this.bloomPass )

        ///////////////////////////////////////////
        
        // this.finalPass = new ShaderPass(
        //   new THREE.ShaderMaterial( {
        //     uniforms: {
        //       baseTexture: { value: null },
        //       bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
        //     },
            
        //     vertexShader: document.getElementById( 'vertexshader' ).textContent,
        //     fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        //     defines: {}
        //   } ), 'baseTexture'
        // );

        // this.finalPass.needsSwap = true;
        // this.finalComposer = new EffectComposer( this.renderer );
        // this.finalComposer.addPass( this.renderScene );
        // this.finalComposer.addPass( this.bloomPass );
        // this.finalComposer.addPass( this.finalPass );

        ////////////////////////////////////////////

    this.setupEnvironment();
    this.frameCount = 0;
    this.loop();
    

  }
  

  
  
  setupEnvironment() {

    this.scene.background = new THREE.Color(0x000000);
    // this.scene.background = new THREE.Color(0xffffff);
    // this.scene.add(new THREE.GridHelper(10, 10));

    // add a ground
    let groundGeo = new THREE.BoxGeometry(100, 1, 100);
    let groundMat = new THREE.MeshStandardMaterial({
      //  color: 0x632E6D ,
       color: 0x0B0C2B,
      //  emissive: 0xffffff,
      //  emissiveIntensity:0.1
      //  metalness:0.1,
       
      });
    let ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0,-3,0);
    ground.castShadow = true;
    ground.receiveShadow = true;
    this.scene.add(ground);

    
    // let ground2Geo = new THREE.BoxGeometry(100, 1, 100);
    // let ground2 = new THREE.Mesh(ground2Geo, groundMat);
    // ground2.position.set(0,5,0);
    // ground2.castShadow = true;
    // ground2.receiveShadow = true;
    // this.scene.add(ground2);    

    let WallHeight=10;
    let WallWidth=20;

    let wallGeo1 = new THREE.BoxGeometry(0.1, WallHeight, WallWidth);
    let wallGeo2 = new THREE.BoxGeometry(0.1, WallHeight, WallWidth);
    let wallGeo3 = new THREE.BoxGeometry(0.1, WallHeight, WallWidth);
    let wallGeo4 = new THREE.BoxGeometry(0.1, WallHeight, WallWidth);

    let wallMat = new THREE.MeshStandardMaterial({ 
      color: 0x000000 ,
      // emissive:0xffffff,
      // roughness: 1 ,
      // metalness: 0.9
    
    });
    
    let wall1 = new THREE.Mesh(wallGeo1, wallMat);
    let wall2 = new THREE.Mesh(wallGeo2, wallMat);
    let wall3 = new THREE.Mesh(wallGeo3, wallMat);
    let wall4 = new THREE.Mesh(wallGeo4, wallMat);

    wall1.position.x=WallWidth/2;
    wall2.position.z=WallWidth/2;
    wall3.position.x=-WallWidth/2;
    wall4.position.z=-WallWidth/2;

    wall1.position.y=WallHeight/2;
    wall2.position.y=WallHeight/2;
    wall3.position.y=WallHeight/2;
    wall4.position.y=WallHeight/2;

    wall2.rotation.y=Math.PI/2;
    wall4.rotation.y=-Math.PI/2;

    wall1.castShadow = true;
    wall2.castShadow = true;
    wall3.castShadow = true;
    wall4.castShadow = true;

    wall1.receiveShadow = true;
    wall2.receiveShadow = true;
    wall3.receiveShadow = true;
    wall4.receiveShadow = true;

    this.scene.add(wall1,wall2,wall3,wall4);

     ////////////////// axesHelper //////////////////
    const axesHelper = new THREE.AxesHelper( 10 );
    axesHelper.setColors(0xffffff,0x00FFFF,0xFF00000);
    this.scene.add(axesHelper);
    // X:white ,Y:blue, Z:red

    ////////////////// DiscoBall //////////////////
    this.discoCenterGroup = new THREE.Group();
    this.discoCenterGroup.position.set(-5,2.5,0);

    this.loader = new GLTFLoader();
    this.loader.load( './disco_ball_animated/scene2.glb',

     ( object ) => {
      // console.log(object);
      let model= object.scene;

      model.scale.set(0.008,0.008,0.008);
      model.position.set(0,0,0);
      model.receiveShadow = true;
      model.casteShadow = true;

      this.texture = new THREE.CanvasTexture( new FlakesTexture());
      this.texture.wrapS= THREE.RepeatWrapping;
      this.texture.wrapT= THREE.RepeatWrapping;
      this.texture.repeat.x=10;
      this.texture.repeat.y=6;

      let newMaterial= {
        clearcoat: 1.0,
        clearcoatRoughness:0,
        metalness:0.7,
        roughness:0.5,
        flatShading:true,
        color:0x818181,
        // emissive:0xffffff,
        // emissiveIntensity:0,
        normalMap:this.texture,
        normalScale: new THREE.Vector2(0.05,0.05)

        };

      model.traverse((o) => {
        if (o.isMesh) o.material = new THREE.MeshPhysicalMaterial(newMaterial);
      });
      
      this.discoCenterGroup.add(object.scene);
      this.scene.add(this.discoCenterGroup);
    });


    ////////////////// furniture //////////////////
    this.furnitureCenterGroup = new THREE.Group();
    this.furnitureCenterGroup.position.set(-7,0.5,0);

    this.loader2 = new GLTFLoader();
    this.loader2.load( './room_furnishings/scene6.glb',
     ( object ) => {
      
      let model= object.scene;

      model.scale.set(0.01,0.01,0.01);
      model.position.set(0,0,0);
      model.castShadow=true;
      model.receiveShadow = true;

      this.furnitureCenterGroup.add(object.scene);
      this.scene.add(this.furnitureCenterGroup);

      ////////////////// ball //////////////////

      let spheregeometry = new THREE.IcosahedronGeometry( 0.5, 5 );

      for ( let i = 0; i < 100; i ++ ) {

        let color = new THREE.Color();
        color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

        let spherematerial = new THREE.MeshBasicMaterial( { color: color } );
        let sphere = new THREE.Mesh( spheregeometry, spherematerial );

        sphere.position.x = (Math.random()-0.5) * 8 ;
        sphere.position.y = (Math.random()-0.0) * 10 ;
        sphere.position.z = (Math.random()-0.5) * 8 ;
        // X:white ,Y:blue, Z:red
        sphere.position.normalize().multiplyScalar( Math.random() * 30.0 + 2.0 );
        sphere.scale.setScalar( Math.random()  - 0.5 );

        // sphere.receiveShadow = true;
        // sphere.casteShadow = true;
        this.scene.add( sphere );

      }
     
    });
    
    //add video
    // const group = new THREE.Group();
    // group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240, 0 ) );
    // group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ) );
    // group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI ) );
    // group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2 ) );
    // scene.add( group );
  
   
    // Block iframe events when dragging camera
  
    // const blocker = document.getElementById( 'blocker' );
    // blocker.style.display = 'none';
  
    // controls.addEventListener( 'start', function () {
    //   blocker.style.display = '';
    // } );
    // controls.addEventListener( 'end', function () {
    //   blocker.style.display = 'none';
    // } );


    ////////////////// light //////////////////
   
    // this.ambientLight = new THREE.AmbientLight(0x818181);
    // this.scene.add(this.ambientLight);

    // this.scene.add( new THREE.AmbientLight( 0x404040 ) );

    // this.pointLight = new THREE.PointLight( 0xffffff, 1 );
    // this.camera.add( this.pointLight );

    // pink
    this.myDirectionalLight1 = new THREE.DirectionalLight(0xFF37C4, 1);
    this.myDirectionalLight1.position.set(-15, 1, 0);
    this.myDirectionalLight1.target = this.discoCenterGroup;
    this.myDirectionalLight1.receiveShadow = true;
    this.myDirectionalLight1.castShadow = true;
    this.scene.add(this.myDirectionalLight1);

    //yellow
    this.myDirectionalLight2 = new THREE.DirectionalLight(0xFF9D40, 1);
    this.myDirectionalLight2.position.set(0, 20, -10);
    this.myDirectionalLight2.target = this.discoCenterGroup;
    this.myDirectionalLight2.receiveShadow = true;
    this.myDirectionalLight2.castShadow = true;
    this.scene.add(this.myDirectionalLight2);

    // blue
    this.myDirectionalLight3 = new THREE.DirectionalLight(0x2810FF, 1);
    this.myDirectionalLight3.position.set(-20, 20, 10);
    this.myDirectionalLight3.target = this.discoCenterGroup;
    this.myDirectionalLight3.receiveShadow = true;
    this.myDirectionalLight3.castShadow = true;
    this.scene.add(this.myDirectionalLight3);

    this.myDirectionalLight4 = new THREE.DirectionalLight(0xffffff, 3);
    this.myDirectionalLight4.position.set(-20, 20, 50);
    this.myDirectionalLight4.target = ground;
    this.myDirectionalLight4.receiveShadow = true;
    this.myDirectionalLight4.castShadow = true;
    // this.scene.add(this.myDirectionalLight4);


    //add spot light
    // let spotLight1 = new THREE.SpotLight({
    // color:0xFFCA00,
    // intensity: 1.2,
    // });
  
    // spotLight1.position.set( -7, 3, 0); 
    // spotLight1.target = this.furnitureCenterGroup; 
    // this.scene.add( spotLight1 );
  
    // let spotLightHelper = new THREE.SpotLightHelper( spotLight1 );
    // this.scene.add( spotLightHelper );
  
  }
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  // Peers 👫

  addPeerAvatar(id) {
    console.log("Adding peer avatar to 3D scene.");
    this.avatars[id] = {};
    let videoElement = document.getElementById(id + "_video");
    let videoTexture = new THREE.VideoTexture(videoElement);
    let videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      overdraw: true,
      side: THREE.DoubleSide,
    });

    let otherMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    let head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), [
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      // videoMaterial,
    ]);

    // set position of head before adding to parent object
    head.position.set(0, 0, 0);

    // https://threejs.org/docs/index.html#api/en/objects/Group
    var group = new THREE.Group();
    group.add(head);

    // add group to scene
    this.scene.add(group);
    this.avatars[id].group = group;

  }

  removePeerAvatar(id) {
    console.log("Removing peer avatar from 3D scene.");
    this.scene.remove(this.avatars[id].group);
    delete this.avatars[id];
  }

  updatePeerAvatars(peerInfoFromServer) {
    for (let id in peerInfoFromServer) {
      if (this.avatars[id]) {
        let pos = peerInfoFromServer[id].position;
        let rot = peerInfoFromServer[id].rotation;

        this.avatars[id].group.position.set(pos[0], pos[1], pos[2]);
        this.avatars[id].group.quaternion.set(rot[0], rot[1], rot[2], rot[3]);
      }
    }
  }

  updateClientVolumes() {
    for (let id in this.avatars) {
      let audioEl = document.getElementById(id + "_audio");
      if (audioEl && this.avatars[id].group) {
        let distSquared = this.camera.position.distanceToSquared(
          this.avatars[id].group.position
        );

        if (distSquared > 500) {
          audioEl.volume = 0;
        } else {
          // https://discourse.threejs.org/t/positionalaudio-setmediastreamsource-with-webrtc-question-not-hearing-any-sound/14301/29
          let volume = Math.min(1, 10 / distSquared);
          audioEl.volume = volume;
        }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Interaction 🤾‍♀️

  getPlayerPosition() {
    return [
      [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      [
        this.camera.quaternion._x,
        this.camera.quaternion._y,
        this.camera.quaternion._z,
        this.camera.quaternion._w,
      ],
    ];
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Rendering 🎥


  loop() {

    this.frameCount++;
    this.controls.update();

    this.discoCenterGroup.rotation.y = this.frameCount/5;
    // update client volumes every 25 frames
    if (this.frameCount % 25 === 0) {
      this.updateClientVolumes();
      this.myDirectionalLight1.intensity = 1*Math.random();
      this.myDirectionalLight2.intensity = 1*Math.random();
      this.myDirectionalLight3.intensity = 1*Math.random();
    }



    this.myDirectionalLight1.position.z=20*Math.sin(this.frameCount/40);
    this.myDirectionalLight2.position.y=20+20*Math.sin(this.frameCount/20);
    this.myDirectionalLight3.position.x=-20+10*Math.sin(this.frameCount/20);
    
    // this.myDirectionalLight4.intensity = Math.random();


  if(this.camera.position.x > 9){
    this.camera.position.x = 9;
  }
  
  if(this.camera.position.x < -9){
    this.camera.position.x = -9;
  }
  
  if(this.camera.position.z > 9){
    this.camera.position.z = 9;
  }
  
  if(this.camera.position.z < -9){
    this.camera.position.z = -9;
  }

  console.log (this.camera.position);

    // this.renderer.render(this.scene, this.camera);
    // console.log(this.camera.rotation);
    // this.renderer.render(this.renderScene, this.camera);
    // this.renderScene.update();
    requestAnimationFrame(() => this.loop());
    this.bloomComposer.render();
    

  }
  
}