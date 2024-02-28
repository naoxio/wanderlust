// src/components/Globe.tsx
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber/native';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3
} from 'three';
import geojsonData from '../data/countries.json';
import { latLongToVector3 } from '../utils/coordinates';

const radius = 5;

const Globe: React.FC = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color(0xffffff);

    // Create a sphere to represent the Earth
    const sphereGeometry = new SphereGeometry(radius, 64, 64); // Increase the segment count for a smoother sphere
    const sphereMaterial = new MeshBasicMaterial({ color: 0xffffff }); // Use a white color for the sphere
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    geojsonData.geometries.forEach((geometry) => {
      const type = geometry.type;
      const coordinates = geometry.coordinates;

      const vertices: number[] = [];
      const meshVertices: Vector3[] = []; 


      const processPolygon = (polygon) => {
        polygon.forEach((ring) => {
          ring.forEach(([lon, lat]) => {
            const vector = latLongToVector3(lat, lon, radius);
            vertices.push(vector.x, vector.y, vector.z);
          });
          // Ensure the loop is closed by repeating the first point
          const [lon, lat] = ring[0];
          const vector = latLongToVector3(lat, lon, radius);
          vertices.push(vector.x, vector.y, vector.z);
        });
      };

      if (type === 'Polygon') {
        processPolygon(coordinates);
      } else if (type === 'MultiPolygon') {
        coordinates.forEach(processPolygon);
      }


      // Create and add mesh for each isolated geometry
      const lineGeometry = new BufferGeometry();
      lineGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
      const mesh = new LineSegments(lineGeometry, lineMaterial);
      scene.add(mesh);
    });
  }, [scene]);

  return null;
};

export default Globe;

