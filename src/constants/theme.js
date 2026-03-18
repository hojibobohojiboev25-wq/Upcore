const darkPalette = {
  background: '#0B1220',
  surface: '#111A2E',
  card: '#17233D',
  border: '#253453',
  primary: '#4F8CFF',
  success: '#23C16B',
  warning: '#FFB020',
  danger: '#FF5C5C',
  text: '#E9EFFD',
  subText: '#A7B4D1'
};

const lightPalette = {
  background: '#F3F6FB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#D8E0EF',
  primary: '#2F6FE4',
  success: '#0F9B52',
  warning: '#E39518',
  danger: '#DC3F3F',
  text: '#13233E',
  subText: '#63779B'
};

export const getPalette = (mode) => (mode === 'light' ? lightPalette : darkPalette);
