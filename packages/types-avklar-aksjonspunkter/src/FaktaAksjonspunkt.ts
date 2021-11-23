import AvklarVergeAp from './fakta/AvklarVergeAp';
import AvklartFaktaFeilutbetalingAp from './fakta/AvklartFaktaFeilutbetalingAp';

export type FaktaAksjonspunkt = AvklarVergeAp
  | AvklartFaktaFeilutbetalingAp;

export default FaktaAksjonspunkt;
