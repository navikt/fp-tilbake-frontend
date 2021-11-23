export {
  range,
  haystack,
  isArrayEmpty,
} from './src/arrayUtils';
export {
  formatCurrencyWithKr,
  formatCurrencyNoKr,
  removeSpacesFromNumber,
  parseCurrencyInput,
} from './src/currencyUtils';
export { default as decodeHtmlEntity } from './src/decodeHtmlEntity';
export {
  fodselsnummerPattern,
  isValidFodselsnummer,
} from './src/fodselsnummerUtils';
export {
  ISO_DATE_FORMAT,
  DDMMYYYY_DATE_FORMAT,
  DDMMYY_DATE_FORMAT,
  HHMM_TIME_FORMAT,
  DATE_TIME_FORMAT,
  YYYY_MM_FORMAT,
  ACCEPTED_DATE_INPUT_FORMATS,
} from './src/formats';
export {
  notNull,
  isObjectEmpty,
  diff,
  isEqual,
  isObject,
  omit,
  omitOne,
  omitMany,
} from './src/objectUtils';
export {
  isIE11,
  isEdge,
  getRelatedTargetIE11,
  forhandsvisDokument,
} from './src/browserUtils';
export {
  ariaCheck,
  validateProsentandel,
  isUtbetalingsgradMerSamitidigUttaksprosent,
  isUkerOgDagerVidNullUtbetalningsgrad,
  isWithinOpptjeningsperiode,
  hasValidPeriod,
  hasValidPeriodIncludingOtherErrors,
  validPeriodeFomTom,
  isDatesEqual,
  dateIsAfter,
  arrayMinLength,
  hasValidValue,
  hasValidName,
  hasValidText,
  hasValidFodselsnummer,
  hasValidFodselsnummerFormat,
  dateAfterOrEqualToToday,
  dateAfterToday,
  dateBeforeOrEqualToToday,
  dateBeforeToday,
  dateRangesNotOverlapping,
  dateRangesNotOverlappingCrossTypes,
  dateAfterOrEqual,
  dateIsBefore,
  dateBeforeOrEqual,
  hasValidDate,
  hasValidSaksnummerOrFodselsnummerFormat,
  hasValidDecimal,
  hasValidInteger,
  maxValue,
  minValue,
  maxValueFormatted,
  minValueFormatted,
  maxLength,
  minLength,
  requiredIfCustomFunctionIsTrue,
  requiredIfCustomFunctionIsTrueNew,
  requiredIfNotPristine,
  notDash,
  required,
  maxLengthOrFodselsnr,
  isTrekkdagerMerEnnNullUtsettelse,
  isUtbetalingMerEnnNullUtsettelse,
  hasValidOrgNumber,
  hasValidOrgNumberOrFodselsnr,
  hasNoWhiteSpace,
} from './src/validation/validators';
export type { Options } from './src/validation/validators';

export {
  isRequiredMessage,
  sammeFodselsnummerSomSokerMessage,
  dateRangesOverlappingMessage,
  dateRangesOverlappingBetweenPeriodTypesMessage,
  invalidPeriodMessage,
  invalidDateMessage,
  invalidDecimalMessage,
  dateNotBeforeOrEqualMessage,
  dateNotAfterOrEqualMessage,
  merEn100ProsentMessage,
  arbeidsprosentMåVare100VidUtsettelseAvArbeidMessage,
} from './src/validation/messages';
export {
  addDaysToDate,
  calcDays,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  dateFormat,
  findDifferenceInMonthsAndDays,
  TIDENES_ENDE,
  timeFormat,
  getRangeOfMonths,
} from './src/dateUtils';
export { getKodeverknavnFn } from './src/kodeverkUtils';
export { default as createIntl } from './src/createIntl';
