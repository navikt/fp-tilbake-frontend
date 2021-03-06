import { Behandling } from '@navikt/ft-types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { BehandlingType, AksjonspunktStatus } from '@navikt/ft-kodeverk';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';

describe('<getAlleMerknaderFraBeslutter>', () => {
  const behandling = {
    uuid: '1',
    versjon: 1,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: BehandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
  };

  const aksjonspunkter = [{
    status: AksjonspunktStatus.OPPRETTET,
    definisjon: aksjonspunktCodes.AVKLAR_VERGE,
    kanLoses: true,
    erAktivt: true,
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: false,
  }];

  it('skal hente alle merknader fra beslutter når behandlingstatus er BEHANDLING_UTREDER', () => {
    const merknader = getAlleMerknaderFraBeslutter(behandling as Behandling, aksjonspunkter);

    expect(merknader).toEqual({
      [aksjonspunkter[0].definisjon]: {
        notAccepted: true,
      },
    });
  });

  it('skal ikke hente merknader  behandlingstatus er ulik BEHANDLING_UTREDER', () => {
    const behandlingMedAnnenStatus = {
      ...behandling,
      status: behandlingStatus.AVSLUTTET,
    };
    const merknader = getAlleMerknaderFraBeslutter(behandlingMedAnnenStatus as Behandling, aksjonspunkter);

    expect(merknader).toEqual({});
  });
});
