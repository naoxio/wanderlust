import type { Metadata } from 'next';
import Globe from '../components/Globe';

export default function IndexPage() {
  return (
    <Globe />
  );
}

export const metadata: Metadata = {
  title: "Traveltint",
};