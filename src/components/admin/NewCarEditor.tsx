'use client';

import { useState } from 'react';

import type { CustomsSettings } from '@/lib/customs';
import type { CarInput } from '@/lib/types';
import { CarForm } from '@/components/admin/CarForm';
import { InspectionImport } from '@/components/admin/InspectionImport';

/** New-car page body: optional PDF import that pre-fills the car form. */
export function NewCarEditor({ customs }: { customs: CustomsSettings }) {
  const [draft, setDraft] = useState<{ key: number; values: Partial<CarInput> }>();

  return (
    <>
      <InspectionImport
        onImport={(values) => setDraft((d) => ({ key: (d?.key ?? 0) + 1, values }))}
      />
      {/* Remount so the uncontrolled inputs pick up the imported defaults. */}
      <CarForm key={draft?.key ?? 0} draft={draft?.values} customs={customs} />
    </>
  );
}
