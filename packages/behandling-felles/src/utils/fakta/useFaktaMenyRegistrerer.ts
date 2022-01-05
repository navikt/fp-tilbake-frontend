import {
  useEffect, useState,
} from 'react';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { usePrevious } from '@fpsak-frontend/shared-components';

const DEFAULT_PANEL_VALGT = 'default';

const useFaktaMenyRegistrerer = (
  dataState: RestApiState,
  id: string,
  valgtFaktaSteg: string,
  skalVisesImeny: boolean,
  harApneAksjonspunkter: boolean,
) => {
  const [erPanelValgt, setPanelValgt] = useState(false);

  const erAktiv = skalVisesImeny && (valgtFaktaSteg === id
    || (harApneAksjonspunkter && valgtFaktaSteg === DEFAULT_PANEL_VALGT));

  const forrigeSkalVisesIMeny = usePrevious(skalVisesImeny);

  useEffect(() => {
    if (dataState === RestApiState.SUCCESS) {
      setPanelValgt(erAktiv);
    }
  }, [dataState, forrigeSkalVisesIMeny, skalVisesImeny, erAktiv, harApneAksjonspunkter]);

  return skalVisesImeny && erPanelValgt;
};

export default useFaktaMenyRegistrerer;
