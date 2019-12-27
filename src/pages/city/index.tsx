/*
 * @文件描述: 城市模型
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2019-12-19 15:22:03
 * @LastEditors  : 阮旭松
 * @LastEditTime : 2019-12-27 21:19:02
 */
import React, { useEffect, useRef, useState } from 'react';
import THREE from 'three.js';
import TWEEN from 'tween.js';
import Stats from 'stats.js';
import styles from './index.module.less';
const background = require('@/assets/yay.jpg');

const Homepage: React.FC = () => {
  const frameDom = useRef<HTMLDivElement | null>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  let renderer;

  useEffect(() => {
    if (frameDom.current) {
      setWidth(frameDom.current.clientWidth);
      setHeight(frameDom.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    let camera;
    var scene;
    let light;
    let line;
    var stats = new Stats();
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
    };
    const initCamera = () => {
      camera = new THREE.PerspectiveCamera(45, width && height ? width / height : 0, 1, 10000);
      camera.position.x = 0;
      camera.position.y = 600;
      camera.position.z = -1000;
      camera.up.x = 0;
      camera.up.y = 0;
      camera.up.z = 1;
      camera.lookAt({
        x: 0,
        y: 0,
        z: 1000,
      });
    };
    const initScene = () => {
      scene = new THREE.Scene();
    };
    // const initLight = () => {
    //   // light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
    //   // light.position.set(0, 0, 0);
    //   light = new THREE.SpotLight(0xff0000, 1.0, 100, (30 * Math.PI) / 180, 10);
    //   light.position.set(400, 400, 400);
    //   scene.add(light);
    // };
    function initLight() {
      light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
      light.position.set(0, 300, 0);
      scene.add(light);
    }
    const initObject = () => {
      // build the base geometry for each building
      var geometry = new THREE.CubeGeometry(1, 1, 1);
      // translate the geometry to place the pivot point at the bottom instead of the center
      geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
      // get rid of the bottom face - it is never seen
      geometry.faces.splice(3, 1);
      geometry.faceVertexUvs[0].splice(3, 1);
      // change UVs for the top face
      // - it is the roof so it wont use the same texture as the side of the building
      // - set the UVs to the single coordinate 0,0. so the roof will be the same color
      //   as a floor row.
      geometry.faceVertexUvs[0][2][0].set(0, 0);
      geometry.faceVertexUvs[0][2][1].set(0, 0);
      geometry.faceVertexUvs[0][2][2].set(0, 0);
      // geometry.faceVertexUvs[0][2][3].set(0, 0);
      // buildMesh
      var buildingMesh = new THREE.Mesh(geometry);

      // base colors for vertexColors. light is for vertices at the top, shaddow is for the ones at the bottom
      var light = new THREE.Color(0xffffff);
      var shadow = new THREE.Color(0x303050);

      var cityGeometry = new THREE.Geometry();
      for (var i = 0; i < 200; i++) {
        // put a random position
        buildingMesh.position.x = Math.floor(Math.random() * 200 - 100) * 10;
        buildingMesh.position.z = Math.floor(Math.random() * 200 - 100) * 10;
        // put a random rotation
        buildingMesh.rotation.y = Math.random() * Math.PI * 2;
        // put a random scale
        buildingMesh.scale.x =
          Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
        buildingMesh.scale.y =
          Math.random() * Math.random() * Math.random() * buildingMesh.scale.x * 8 + 8;
        buildingMesh.scale.z = buildingMesh.scale.x;

        // establish the base color for the buildingMesh
        var value = 1 - Math.random() * Math.random();
        var baseColor = new THREE.Color().setRGB(
          value + Math.random() * 0.1,
          value,
          value + Math.random() * 0.1,
        );
        // set topColor/bottom vertexColors as adjustement of baseColor
        var topColor = baseColor.clone().multiply(light);
        var bottomColor = baseColor.clone().multiply(shadow);
        // set .vertexColors for each face
        var geometry = buildingMesh.geometry;
        for (var j = 0, jl = geometry.faces.length; j < jl; j++) {
          if (j === 2) {
            // set face.vertexColors on root face
            geometry.faces[j].vertexColors = [baseColor, baseColor, baseColor, baseColor];
          } else {
            // set face.vertexColors on sides faces
            geometry.faces[j].vertexColors = [topColor, bottomColor, bottomColor, topColor];
          }
        }
        // merge it with cityGeometry - very important for performance
        THREE.GeometryUtils.merge(cityGeometry, buildingMesh);
      }

      // generate the texture
      var texture = new THREE.Texture(THREE.ImageUtils.loadTexture(background));
      texture.anisotropy = renderer.getMaxAnisotropy();
      texture.needsUpdate = true;
      // var material = new THREE.MeshBasicMaterial({ map: texture });
      // build the mesh
      var material = new THREE.MeshLambertMaterial({
        map: texture,
        vertexColors: THREE.VertexColors,
      });
      var cityMesh = new THREE.Mesh(cityGeometry, material);

      scene.add(cityMesh);
    };
    function initTween() {
      // new TWEEN.Tween(line.position)
      //   .to({ x: 400, y: 400 }, 3000)
      //   .repeat(Infinity)
      //   .start();
      // new TWEEN.Tween(camera.position)
      //   .to({ x: 400 }, 3000)
      //   .repeat(Infinity)
      //   .start();
    }
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
      requestAnimationFrame(animation);
      TWEEN.update();
    };

    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    render();
    initTween();
    animation();
  }, [height, renderer, width, x, y]);

  /** 转动线 */
  const handleSpin = () => {
    const newX = x + 100;
    const newY = y - 100;
    setX(newX);
    setY(newY);
  };
  return (
    <>
      <div
        className={styles.canvasFrame}
        ref={ref => {
          frameDom.current = ref;
        }}
      ></div>
      {/* <Button onClick={handleSpin}>city</Button> */}
    </>
  );
};

export default Homepage;
