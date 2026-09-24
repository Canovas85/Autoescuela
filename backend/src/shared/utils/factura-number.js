const FACTURA_PREFIX = "FAC-";
const FACTURA_RANDOM_SUFFIX_LENGTH = 4;
const FACTURA_RANDOM_SUFFIX_MAX = 10 ** FACTURA_RANDOM_SUFFIX_LENGTH;

export const FACTURA_NUMERO_REGEX = /^FAC-[0-9]+$/;

export const generateFacturaNumber = (attempt = 0) => {
  const timestamp = Date.now().toString();
  const randomBase =
    Math.floor(Math.random() * FACTURA_RANDOM_SUFFIX_MAX) +
    Number(attempt || 0);
  const suffix = (randomBase % FACTURA_RANDOM_SUFFIX_MAX)
    .toString()
    .padStart(FACTURA_RANDOM_SUFFIX_LENGTH, "0");

  return `${FACTURA_PREFIX}${timestamp}${suffix}`;
};
