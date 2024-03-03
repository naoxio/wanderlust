import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { PerspectiveCamera } from 'three';
import useControls from 'r3f-native-orbitcontrols';
import Globe from './Globe';
import { styles } from '../styles/styles';

const GlobeScene: React.FC = () => {
  const [OrbitControls, events] = useControls();
  const cameraRef = useRef(new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)).current;
  cameraRef.position.z = 10;

  useEffect(() => {
    const handleScroll = (e) => {
      // Adjust the camera's z position based on the scroll direction
      cameraRef.position.z += e.deltaY * 0.01;

      // Clamp the camera's z position to prevent it from going too close or too far
      cameraRef.position.z = Math.max(Math.min(cameraRef.position.z, 100), 5);
    };

    // Add event listener for the mouse scroll
    window.addEventListener('wheel', handleScroll);

    // Remove event listener on cleanup
    return () => window.removeEventListener('wheel', handleScroll);
  }, [cameraRef]);

  return (
    <View style={styles.container} {...events}>
      <Canvas camera={cameraRef}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-1, 2, 4]} intensity={1} />
        <Globe />
        <OrbitControls />
      </Canvas>
    </View>
  );
};

export default GlobeScene;
