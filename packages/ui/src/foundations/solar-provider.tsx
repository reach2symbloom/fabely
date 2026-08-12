/**
 * Fabely Solar provider — Bold Duotone defaults + secondary-layer opacity
 * via `data-fabely-solar` (see foundations/iconography.css).
 */
'use client';

import * as React from 'react';
import { SolarProvider } from '@solar-icons/react';

export function FabelySolarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolarProvider
      value={{
        weight: 'BoldDuotone',
        color: 'currentColor',
      }}
      svgProps={
        {
          'data-fabely-solar': '',
        } as React.SVGProps<SVGSVGElement>
      }
    >
      {children}
    </SolarProvider>
  );
}
