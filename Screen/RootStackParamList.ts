export type RootStackParamList = {
    Home: any;
    Profile: {
        User: any,
        loggedIn: any
    };
    ProfileEdit:{
        User:any,
    };
    ProductScreen: any;
    ProductRate:any;
    FigureDetails: {
        item: any;
    };
    Cart:{
        User:any
    };
    CartDelete:{
        User:any
    };
    ShipAddress:{
        User:any
    };
    ShipAddressEdit:{
        User: any
    };
    ShipAddressDelete:{
        User: any
    };
    ShipAddressAdd:{
        User: any
    }
    TopUp:{
        User:any
    };
    ToPay:{
        User:any
    };
    ToRate:{
        User:any
    };
    ChangePassword:{
        User: any
    }
    SignIn: any;
    LogIn: any;
}