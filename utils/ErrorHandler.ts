export class ErrorHandler extends Error {
    stausCode:Number;

    constructor(message:any,statusCode:Number){
        super(message);
        this.stausCode =statusCode;

        Error.captureStackTrace(this,this.constructor)
} 
}