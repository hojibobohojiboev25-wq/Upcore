import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'upcore_data_v2';

export const loadState = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const saveState = async (state) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // silent fail for local storage edge cases
  }
};
