export class Constant{
    // Prod
    // public static phpServiceURL = "https://trinityapplab.in/Pickaro/";
    public static phpServiceURL = "/Pickaro/"

    public static SUCCESSFUL_STATUS_CODE = "200";
    public static PICKARO_PRIVATE_KEY = "PICKAROPRIVATEKEY";
    public static STORE_KEY =  'lastAction';
    public static CHECK_INTERVAL = 15000; // in ms
    public static MINUTES_UNTIL_AUTO_LOGOUT = 10; // in mins
    public static IMG_WIDTH = 1280;
    public static IMG_HEIGHT = 720;
    public static returnServerErrorMessage(serviceName:string):string{
        return "Server error while invoking "+serviceName+ " service";
    }

}