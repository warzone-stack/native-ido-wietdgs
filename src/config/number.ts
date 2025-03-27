import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
  FORMAT: {
    // string to prepend
    prefix: '',
    // decimal separator
    decimalSeparator: '.',
    // grouping separator of the integer part
    groupSeparator: ',',
    // primary grouping size of the integer part
    groupSize: 3,
    // secondary grouping size of the integer part
    secondaryGroupSize: 0,
    // grouping separator of the fraction part
    fractionGroupSeparator: ' ',
    // grouping size of the fraction part
    fractionGroupSize: 0,
    // string to append
    suffix: '',
  },
});

export function formatTokenAmount(
  amount: BigNumber | undefined,
  decimals: number | undefined,
  shorter = false
) {
  if (!amount || decimals == undefined) {
    return '0';
  }

  const absValue = amount.abs();
  const showDecimals = decimals > 6 ? 6 : 4;

  if (shorter) {
    if (absValue.isGreaterThanOrEqualTo(1e9)) {
      return amount.dividedBy(1e9).dp(showDecimals, BigNumber.ROUND_DOWN).toFormat() + 'B';
    }

    if (absValue.isGreaterThanOrEqualTo(1e6)) {
      return amount.dividedBy(1e6).dp(showDecimals, BigNumber.ROUND_DOWN).toFormat() + 'M';
    }

    if (absValue.isGreaterThanOrEqualTo(1e3)) {
      return amount.dividedBy(1e3).dp(showDecimals, BigNumber.ROUND_DOWN).toFormat() + 'K';
    }
  }

  return amount.dp(showDecimals, BigNumber.ROUND_DOWN).toFormat();
}
