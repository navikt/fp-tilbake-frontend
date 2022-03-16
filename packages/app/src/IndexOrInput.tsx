import React, { useState, FunctionComponent } from 'react';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';
import BehandlingTilbakekrevingIndex from './BehandlingTilbakekrevingIndex';
import BehandlingEventHandler from './felles/util/BehandlingEventHandler';

const IndexOrInput: FunctionComponent = () => {
  const [behandlingUuid, setBehandlingUuid] = useState<string | undefined>();
  const [valgtProsessSteg, setProsessSteg] = useState('default');
  const [valgtFaktaSteg, setFaktaSteg] = useState('default');

  if (!behandlingUuid) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <>
          BehandlingUuid:
          <input type="text" id="bUuid" />
          <button
            type="button"
            onClick={() => {
              setBehandlingUuid((document.getElementById('bUuid') as HTMLInputElement).value);
            }}
          >
            Hent behandling
          </button>
        </>
      );
    }
    return <div>Micro frontend - FPTILBAKE</div>;
  }

  const oppdaterProsessStegOgFaktaPanelIUrl = (punktnavn?: string, faktanavn?: string) => {
    setProsessSteg(punktnavn);
    setFaktaSteg(faktanavn);
  };

  return (
    <BehandlingTilbakekrevingIndex
      behandlingUuid={behandlingUuid}
      fagsak={{
        dekningsgrad: 100,
        fagsakYtelseType: 'FP',
        relasjonsRolleType: 'MORA',
        saksnummer: '152001002',
        status: 'LOP',
      }}
      rettigheter={{
        kanOverstyreAccess: {
          employeeHasAccess: true,
          isEnabled: true,
        },
        writeAccess: {
          employeeHasAccess: true,
          isEnabled: true,
        },
      }}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      valgtProsessSteg={valgtProsessSteg}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterBehandlingVersjon={() => undefined}
      behandlingEventHandler={BehandlingEventHandler}
      opneSokeside={() => undefined}
      setRequestPendingMessage={() => undefined}
      // @ts-ignore
      kodeverk={alleKodeverk}
      fagsakKjønn="K"
      harApenRevurdering={false}
    />
  );
};

export default IndexOrInput;
