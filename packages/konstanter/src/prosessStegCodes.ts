// Definerer alle prosess-steg. Desse verdien blir vist i URL og brukt i historikk-elementene.
enum ProsessStegCode {
  DEFAULT = 'default',
  TILBAKEKREVING = 'tilbakekreving',
  FORELDELSE = 'foreldelse',
  VEDTAK = 'vedtak',
}

export default ProsessStegCode;
