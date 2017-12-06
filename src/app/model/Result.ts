export class Result
{
    info: string;
    error: string;
    success: boolean;
    textSuccess: string;

    constructor(error ?: string, info ?: string, success : boolean = false)
    {
        this.error = error;
        this.info = info;
        this.success = success;
        this.textSuccess = null;
    }

    updateInfo(info: string)
    {
        this.error = null;
        this.info = info;
        this.success = false;
        this.textSuccess = null;
    }

    updateError(error?: string)
    {
        var err = "something went wrong... please try again later.";
        this.error = error ? error : err;
        this.info = null;
        this.success = false;
        this.textSuccess = null;
    }

    updateSuccess(success: boolean)
    {
        this.error = null;
        this.info = null;
        this.success = success;
        this.textSuccess = null;
        
        setTimeout(() => 
        {
            this.success = false;
        }, 2000);
    }

    updateTextSuccess(msg: string)
    {
        this.error = null;
        this.info = null;
        this.success = false;
        this.textSuccess = msg;

        setTimeout(() => 
        {
            this.textSuccess = null;
        }, 5000);
    }
}