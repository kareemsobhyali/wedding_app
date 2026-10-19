import React from 'react';
import { templateRegistry } from '../templates/registry';
import LandingClient from './LandingClient';
import { getSettings } from '../lib/settings';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const settings = getSettings();
  const templatesList = Object.values(templateRegistry).map(t => t.metadata);

  return <LandingClient settings={settings} templatesList={templatesList} />;
}
