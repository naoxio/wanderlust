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

interface Feature {
  type: string;
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSON {
  type: string;
  features: Feature[];
}

const radius = 5;

const Globe: React.FC = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color(0xffffff);

    const sphereGeometry = new SphereGeometry(radius, 32, 32);
    const sphereMaterial = new MeshBasicMaterial({ color: 0x007BA7 });
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const countriesData: { [key: string]: number[] } = {};

    (geojsonData as GeoJSON).features.forEach((feature) => {
      const countryName = feature.properties.name;
      const { type, coordinates } = feature.geometry;

      const vertices: number[] = [];

      const processPolygon = (polygon: number[][][]) => {
        polygon.forEach((ring) => {
          ring.forEach(([lon, lat]) => {
            const vector = latLongToVector3(lat, lon, radius);
            vertices.push(vector.x, vector.y, vector.z);
          });
          const [lon, lat] = ring[0];
          const vector = latLongToVector3(lat, lon, radius);
          vertices.push(vector.x, vector.y, vector.z);
        });
      };

      if (type === 'Polygon') {
        processPolygon(coordinates as number[][][]);
      } else if (type === 'MultiPolygon') {
        (coordinates as number[][][][]).forEach(processPolygon);
      }

      countriesData[countryName] = vertices;

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
