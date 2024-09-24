import type { Metadata } from 'next';
import GlobeContainer from '../components/GlobeContainer';

export default function IndexPage() {
  return <GlobeContainer />;
}

export const metadata: Metadata = {
  title: "Traveltint",
};