import axios from 'axios';

const NIGERIA_COUNTRY_CODE = 'NG';
const NIGERIA_CURRENCY = 'NGN';
const DEFAULT_CURRENCY = 'USD';

export const detectRegion = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    const { country_code } = response.data;
    
    return {
      countryCode: country_code,
      currency: country_code === NIGERIA_COUNTRY_CODE ? NIGERIA_CURRENCY : DEFAULT_CURRENCY,
      isNigeria: country_code === NIGERIA_COUNTRY_CODE
    };
  } catch (error) {
    console.error('Error detecting region:', error);
    // Return default values if detection fails
    return {
      countryCode: null,
      currency: DEFAULT_CURRENCY,
      isNigeria: false
    };
  }
}; 