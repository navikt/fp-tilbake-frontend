type Fagsak = Readonly<{
  saksnummer: string;
  fagsakYtelseType: {
    kode: string;
    kodeverk: string;
  } | string;
  relasjonsRolleType: {
    kode: string;
    kodeverk: string;
  } | string;
  status: {
    kode: string;
    kodeverk: string;
  } | string;
  dekningsgrad: number;
}>

export default Fagsak;
