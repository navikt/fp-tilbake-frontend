import { Fagsak, AlleKodeverk } from '@navikt/ft-types';
import AksessRettigheter from './aksessRettigheterTsType';

export type BehandlingEventHandler = {
  setHandler: (events: {[key: string]: (params: any) => Promise<any> }) => void;
  clear: () => void;
};

type StandardBehandlingProps = {
  behandlingUuid: string;
  fagsak: Fagsak;
  rettigheter: AksessRettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: BehandlingEventHandler;
  opneSokeside: () => void;
  setRequestPendingMessage: (message?: string) => void;
  kodeverk: AlleKodeverk;
}

export default StandardBehandlingProps;
