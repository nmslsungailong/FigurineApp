import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeUserLoggedInData = async ({userData, LogInStatus}: any) => {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem('@user', jsonValue);
      const LogInStatusString = JSON.stringify(LogInStatus);
      await AsyncStorage.setItem('@isLoggedIn', LogInStatusString);

    } catch (e) {
      console.log('Error' + e);
    }
  }

export const storePreferredAddressID = async (AddressID : any) =>{
    try{
        const asyncAddressID = JSON.stringify(AddressID)
        await AsyncStorage.setItem('@preferredAddressId', asyncAddressID);
        console.log(await AsyncStorage.getItem('@preferredAddressId'));
    }catch (e){
        console.log('Error' + e);
    }
}