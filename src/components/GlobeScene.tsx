import React from 'react';
import { View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { PerspectiveCamera } from 'three';
import useControls from 'r3f-native-orbitcontrols';
import Globe from './Globe';
import { styles } from '../styles/styles';

const GlobeScene: React.FC = () => {
  const [OrbitControls, events] = useControls();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  
  return (
    <View style={styles.container} {...events}>
      <Canvas camera={camera}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-1, 2, 4]} intensity={1} />
        <Globe />
        <OrbitControls />
      </Canvas>
    </View>
  );
};

export default GlobeScene;
