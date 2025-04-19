import { useSelector } from 'react-redux';
import { selectUser } from '../redux/selectors/auth';

// Base prices in NGN
const BEAT_PRICE_NGN = 10000;
const BEAT_PRICE_USD = 10;
const GUARD_PRICE_NGN = 2000;
const GUARD_PRICE_USD = 2;
const CURRENCY_CODE_NGN = '₦';
const CURRENCY_CODE_USD = '$';

export const useCurrency = () => {
  const user = useSelector(selectUser);
  const currency = user?.currency || 'NGN';

  const getBeatPrice = () => {
    switch (currency) {
      case 'NGN':
        return BEAT_PRICE_NGN;
      case 'USD':
        return BEAT_PRICE_USD;
      default:
        return BEAT_PRICE_NGN;
    }
  };

  const getGuardPrice = () => {
    switch (currency) {
      case 'NGN':
        return GUARD_PRICE_NGN;
      case 'USD':
        return GUARD_PRICE_USD;
      default:
        return GUARD_PRICE_NGN;
    }
  };

  const getCurrencyCode = () => {
    switch (currency) {
      case 'NGN':
        return CURRENCY_CODE_NGN;
      case 'USD':
        return CURRENCY_CODE_USD;
      default:
        return CURRENCY_CODE_NGN;
    }
  };

  return {
    getBeatPrice,
    getGuardPrice,
    getCurrencyCode,
    currency
  };
};

export const POOLING_TIME = process.env.REACT_APP_POOLING_TIME || 10000;
// export const POOLING_TIME = 9000000;
// export const POOLING_TIMES = { MIN: 9000000, MID: 90000000, MAX: 90000000 };
export const POOLING_TIMES = { MIN: 10000, MID: 150000, MAX: 300000 };
