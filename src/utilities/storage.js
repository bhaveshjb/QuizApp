import AsyncStorage from '@react-native-community/async-storage';

async function setKey(key, value) {
  try {
    if (typeof value === 'object' || 'int') {
      value = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
}

async function getKey(key) {
  let value;
  return new Promise( async (resolve,reject) => {
    try {
      value = await AsyncStorage.getItem(key);
      value = JSON.parse(value);
      return  resolve(value);
    } catch (e) {
      return reject(e);
    }
  })  
}

async function removeKey(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    console.warn('removeKey exception', exception);
    return false;
  }
}

module.exports = {setKey, getKey, removeKey};
