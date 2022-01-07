import { Behandling, Fagsak } from '@fpsak-frontend/types';
import { FaktaAksjonspunkt, ProsessAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

export const DEFAULT_FAKTA_KODE = 'default';
export const DEFAULT_PROSESS_STEG_KODE = 'default';

export const getBekreftAksjonspunktFaktaCallback = (
  fagsak: Fagsak,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void,
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<Behandling | undefined>,
) => (aksjonspunkter: FaktaAksjonspunkt | FaktaAksjonspunkt[]): Promise<void> => {
  const apListe = Array.isArray(aksjonspunkter) ? aksjonspunkter : [aksjonspunkter];
  const model = apListe.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingUuid: behandling.uuid,
    behandlingVersjon: behandling.versjon,
  };

  return lagreAksjonspunkter({
    ...params,
    bekreftedeAksjonspunktDtoer: model,
  }, true).then(() => oppdaterProsessStegOgFaktaPanelIUrl(DEFAULT_PROSESS_STEG_KODE, DEFAULT_FAKTA_KODE));
};

export const getBekreftAksjonspunktProsessCallback = (
  fagsak: Fagsak,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void,
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>,
) => (
  lagringSideEffectsCallback?: (aksjonspunktModeller: any) => () => void,
) => (
  aksjonspunkterSomSkalLagres: ProsessAksjonspunkt | ProsessAksjonspunkt[],
) => {
  const apListe = Array.isArray(aksjonspunkterSomSkalLagres) ? aksjonspunkterSomSkalLagres : [aksjonspunkterSomSkalLagres];
  const models = apListe.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingUuid: behandling.uuid,
    behandlingVersjon: behandling.versjon,
  };

  const etterLagringCallback = lagringSideEffectsCallback ? lagringSideEffectsCallback(apListe) : undefined;

  return lagreAksjonspunkter({
    ...params,
    bekreftedeAksjonspunktDtoer: models,
  }, true).then(() => {
    if (etterLagringCallback) {
      return etterLagringCallback();
    }
    return oppdaterProsessStegOgFaktaPanelIUrl(DEFAULT_PROSESS_STEG_KODE, DEFAULT_FAKTA_KODE);
  });
};
