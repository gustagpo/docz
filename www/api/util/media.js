docz.util.media = class MediaUtil {
    constructor(arquivo){
        this.arquivo = arquivo;
        this.mp3URL = MediaUtil.getMediaURL("media/"+arquivo);
        this.media = new Media(this.mp3URL, null, (err)=>{
            console.log(err);
        });
    }

    play(){
        this.media.stop();
        this.media.release();
        this.media.play();
    }

    static getMediaURL(s) {
        if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
        return s;
    }

};