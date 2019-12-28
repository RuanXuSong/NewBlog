/* eslint-disable complexity */
/*
 * @文件描述: 首页
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-12-19 15:22:03
 * @LastEditors  : 阮旭松
 * @LastEditTime : 2019-12-28 14:37:24
 */
import React, { useEffect, useRef, useState } from 'react';
import THREE from 'three.js';
// import TWEEN from 'tween.js';
import Stats from 'stats.js';
import styles from './index.module.less';
import Link from 'umi/link';
import FirstPersonControls from '@/utils/FirstPersonControls.js';
import OBJLoader from '@/utils/OBJLoader.js';
// import MTLLoader from '@/utils/MTLLoader.js';

const background = require('@/assets/yay.jpg');
const floor = require('@/assets/floor.jpeg');
// const wallBackground = require('@/assets/wallBackground.jpg');
const upBackground = require('@/assets/upPage.jpg');
const tableObj = require('@/assets/obj/Wood_Table.obj');
// const tableMtl = require('@/assets/obj/Wood_Table.mtl');
const plantObj = require('@/assets/obj/indoor_plant.obj');
// const plantMtl = require('@/assets/obj/indoor_plant.mtl');

const Homepage: React.FC = () => {
  const frameDom = useRef<HTMLDivElement | null>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  let renderer;

  useEffect(() => {
    if (frameDom.current) {
      setWidth(frameDom.current.clientWidth);
      setHeight(frameDom.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    let camera;
    let scene;
    let light;
    let camControls;
    let clock = new THREE.Clock();

    let cameraDirection = {
      x: 0,
      y: 0,
      z: 0,
    };
    let stats = new Stats();
    document.body.appendChild(stats.dom);
    const initThree = () => {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      renderer.setSize(width, height);
      frameDom.current!.appendChild(renderer.domElement);
      renderer.setClearColor(0xffffff, 1.0);
      renderer.shadowMapEnabled = true;
    };
    const initCamera = () => {
      camera = new THREE.PerspectiveCamera(45, width && height ? width / height : 0, 1, 10000);
      camera.position.x = 300;
      camera.position.y = 0;
      camera.position.z = 200;
      camera.up.x = 0;
      camera.up.y = 1;
      camera.up.z = 0;
      camControls = new FirstPersonControls(camera);
      camera.lookAt(cameraDirection);
      camControls.enabled = true;
      camControls.lookSpeed = 0.1;
      camControls.movementSpeed = 300;
      camControls.noFly = true;
      camControls.lookVertical = true;
      camControls.constrainVertical = true;
      camControls.verticalMin = 1.0;
      camControls.verticalMax = 2.0;
      camControls.lon = 270;
      camControls.lat = 0;
    };

    const initScene = () => {
      scene = new THREE.Scene();
    };
    const initLight = () => {
      // light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
      // light.position.set(0, 0, 0);
      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(300, 400, 100);
      scene.add(pointLight);
      light = new THREE.DirectionalLight('#ffffff');
      light.position.set(-40, 60, -10);
      light.shadow.camera.near = 20; //产生阴影的最近距离
      light.shadow.camera.far = 200; //产生阴影的最远距离
      light.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
      light.shadow.camera.right = 50; //最右边
      light.shadow.camera.top = 50; //最上边
      light.shadow.camera.bottom = -50; //最下面

      //这两个值决定使用多少像素生成阴影 默认512
      light.shadow.mapSize.height = 512;
      light.shadow.mapSize.width = 512;
      //告诉平行光需要开启阴影投射
      light.castShadow = true;

      scene.add(light);
    };
    const initObject = () => {
      // var geometry = new THREE.Geometry();
      // geometry.vertices.push(new THREE.Vector3(500, 0, 100));
      // geometry.vertices.push(new THREE.Vector3(-500, 0, 100));

      /** 加墙体函数 */
      const addWall = (x = 0, y = 0, z = 0) => (length, width, thick) => {
        const wallGeometry = new THREE.BoxGeometry(length, width, thick); //长宽厚
        const wallMaterials = new THREE.MeshLambertMaterial({
          color: 0xfefbd1,
          side: THREE.DoubleSide,
        });
        // var texture = THREE.ImageUtils.loadTexture(wallBackground);
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(8, 4);
        // var wallMaterials = new THREE.MeshBasicMaterial({ map: texture });
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterials);
        wallMesh.position.y = y;
        wallMesh.position.x = x;
        wallMesh.position.z = z;
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        scene.add(wallMesh);
      };

      /** 加右边墙体*/
      addWall(1300)(2, 1000, 2800);
      /** 加前面墙体*/
      addWall(500, 0, -1300)(2500, 1000, 2);
      /** 加左面墙体*/
      addWall(-700)(2, 1000, 2800);
      /** 加后面墙体*/
      addWall(500, 0, 1300)(2500, 1000, 2);

      /** 加地板 */
      const floorGeometry = new THREE.BoxGeometry(2500, 2, 2800);
      var texture = THREE.ImageUtils.loadTexture(floor);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      var floorMaterials = new THREE.MeshLambertMaterial({ map: texture });
      const floorMesh = new THREE.Mesh(floorGeometry, floorMaterials);
      floorMesh.position.y = -500;
      floorMesh.position.x = 100;
      floorMesh.position.z = 0;
      floorMesh.castShadow = true;
      floorMesh.receiveShadow = true;

      scene.add(floorMesh);

      /** 加天花板 */
      const topGeometry = new THREE.BoxGeometry(2500, 2, 2800);
      var texture = THREE.ImageUtils.loadTexture(upBackground);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
      var topMaterials = new THREE.MeshBasicMaterial({ map: texture });
      const topMesh = new THREE.Mesh(topGeometry, topMaterials);
      topMesh.position.y = 500;
      topMesh.position.x = 100;
      topMesh.position.z = 0;
      scene.add(topMesh);

      /** 右面图片 */
      for (let i = 0; i < 4; i++) {
        var geometry = new THREE.PlaneGeometry(200, 200, 0, 0);
        var texture = THREE.ImageUtils.loadTexture(background);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 1298;
        mesh.position.y = 200;
        mesh.position.z = -400 + 400 * i;
        mesh.rotation.y = -Math.PI * 0.5;
        mesh.castShadow = true;

        scene.add(mesh);
      }

      /** 前面图片 */
      for (let i = 0; i < 4; i++) {
        var geometry = new THREE.PlaneGeometry(200, 200, 0, 0);
        var texture = THREE.ImageUtils.loadTexture(background);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -300 + 400 * i;
        mesh.position.y = 200;
        mesh.position.z = -1298;
        mesh.castShadow = true;

        scene.add(mesh);
      }
      /** 后面图片 */
      for (let i = 0; i < 4; i++) {
        var geometry = new THREE.PlaneGeometry(200, 200, 0, 0);
        var texture = THREE.ImageUtils.loadTexture(background);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -300 + 400 * i;
        mesh.position.y = 200;
        mesh.position.z = 1298;
        mesh.rotation.y = -Math.PI * 1;
        mesh.castShadow = true;

        scene.add(mesh);
      }

      /** 左面图片 */
      for (let i = 0; i < 4; i++) {
        var geometry = new THREE.PlaneGeometry(200, 200, 0, 0);
        var texture = THREE.ImageUtils.loadTexture(background);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -698;
        mesh.position.y = 200;
        mesh.position.z = -400 + 400 * i;
        mesh.rotation.y = Math.PI * 0.5;
        mesh.castShadow = true;

        scene.add(mesh);
      }

      /** 导入桌子(带材质) */
      //obj文件加载loader;
      // var loader = new OBJLoader();
      // var mtlLoader = new MTLLoader(); //材质文件加载器
      // mtlLoader.load(tableMtl, function(materials) {
      //   // 返回一个包含材质的对象MaterialCreator
      //   //obj的模型会和MaterialCreator包含的材质对应起来
      //   loader.setMaterials(materials);
      //   loader.load(tableObj, function(object) {
      //     //taverse函数为遍历object的每个子mesh，传入的child为每个mesh
      //     //该示例中的object为一个group，有多个mesh组成
      //     object.traverse(function(child) {
      //       if (child instanceof THREE.Mesh) {
      //         // child.material = materials;
      //         // enable casting shadows
      //         child.castShadow = true;
      //         child.receiveShadow = true;
      //       }
      //     });
      //     object.position.x = 300;
      //     object.position.y = -500;
      //     object.position.z = 200;
      //     object.scale.set(400, 400, 400);

      //     scene.add(object);
      //   });
      // });

      /** 导入桌子(不带材质) */
      const loader = new OBJLoader();
      loader.load(tableObj, function(object) {
        const materials = new THREE.MeshLambertMaterial({
          color: 0xcda93a,
          side: THREE.DoubleSide,
        });
        //taverse函数为遍历object的每个子mesh，传入的child为每个mesh
        //该示例中的object为一个group，有多个mesh组成
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = materials;
            // enable casting shadows
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.position.x = 300;
        object.position.y = -500;
        object.position.z = 200;
        object.scale.set(500, 500, 500);

        scene.add(object);
      });

      // var plantloader = new OBJLoader();
      // var mtlLoader = new MTLLoader(); //材质文件加载器
      // mtlLoader.load('/obj/indoor_plant.mtl', function(materials) {
      //   materials.preload();
      //   // 返回一个包含材质的对象MaterialCreator
      //   //obj的模型会和MaterialCreator包含的材质对应起来
      //   plantloader.setMaterials(materials);
      //   console.log('materials: ', materials);
      //   plantloader.load('/obj/indoor_plant.obj', function(object) {
      //     //taverse函数为遍历object的每个子mesh，传入的child为每个mesh
      //     //该示例中的object为一个group，有多个mesh组成
      //     object.traverse(function(child) {
      //       if (child instanceof THREE.Mesh) {
      //         child.material.emissive = new THREE.Color(1, 1, 1);
      //         child.material.emissiveIntensity = 1;
      //         child.material.emissiveMap = child.material.map;
      //         // child.material.transparent = true;
      //         // child.shading = THREE.FlatShading;
      //         // child.material = materials;
      //         // enable casting shadows
      //         // child.castShadow = true;
      //         // child.receiveShadow = true;
      //       }
      //     });
      //     object.position.x = 300;
      //     object.position.y = 0;
      //     object.position.z = 200;
      //     object.scale.set(30, 30, 30);

      //     scene.add(object);
      //   });
      // });

      /** 加盆栽 */
      function addNewPlant(x, y, z, rotation) {
        const plantLoader = new OBJLoader();
        plantLoader.load(plantObj, function(object) {
          const materials = new THREE.MeshLambertMaterial({
            color: 0x87ca43,
            side: THREE.DoubleSide,
          });
          //taverse函数为遍历object的每个子mesh，传入的child为每个mesh
          //该示例中的object为一个group，有多个mesh组成
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = materials;
              // enable casting shadows
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          /** 右后方盆栽 */
          object.position.x = x;
          object.position.y = y;
          object.position.z = z;
          object.rotation.y = -(Math.PI * rotation) / 180;
          object.scale.set(30, 30, 30);
          scene.add(object);
        });
      }

      /** 右后方盆栽 */
      addNewPlant(1200, -500, 1225, -90);
      /** 左后方盆栽 */
      addNewPlant(-625, -500, 1225, -90);
      /** 左前方盆栽 */
      addNewPlant(-625, -500, -1250, 0);
      /** 右前方盆栽 */
      addNewPlant(1200, -500, -1250, 90);
    };
    // function initTween() {
    // new TWEEN.Tween(line.position)
    //   .to({ x: 400, y: 400 }, 3000)
    //   .repeat(Infinity)
    //   .start();
    /** 走进去动作 */
    //   const stepIn = new TWEEN.Tween(camera.position).to({ z: -100 }, 3000);
    //   stepIn.start();
    // }
    const render = () => {
      renderer.clear();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    const animation = () => {
      //renderer.clear();
      // line.position.y = line.position.y + 1;
      renderer.render(scene, camera);
      stats.update();

      //更新控制器
      camControls.update(clock.getDelta());
      requestAnimationFrame(animation);
      // TWEEN.update();
    };

    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    render();
    // initTween();
    animation();
  }, [height, renderer, width]);

  return (
    <>
      <div
        className={styles.canvasFrame}
        ref={ref => {
          frameDom.current = ref;
        }}
      ></div>
      <Link to="/city">city</Link>
      <Link to="/2dGirl"> 2dGirl</Link>
    </>
  );
};

export default Homepage;
