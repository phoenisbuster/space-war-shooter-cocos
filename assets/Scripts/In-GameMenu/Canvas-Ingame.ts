import GameMusic from "../GameAudio/GameMusic";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CanvasInGame extends cc.Component {

    @property(cc.SpriteFrame)
    SoundOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    SoundOff: cc.SpriteFrame = null;

    @property(cc.Node)
    SoundBtn: cc.Node = null;

    @property(cc.Boolean)
    isSoundOn: boolean = true;

    GameMusic: cc.Node = null;

    public OnClickQuit()
    {
        cc.Tween.stopAll();
        this.unscheduleAllCallbacks();
        cc.director.loadScene("GameMenu");
    }

    public OnClickPlayAgain()
    {
        cc.director.loadScene(cc.director.getScene().name);
    }

    public OnClickChangeSound()
    {
        if(this.SoundBtn != null)
        {    
            if(this.isSoundOn)
            {
                this.isSoundOn = false;
                this.GameMusic.getComponent(GameMusic).isPause = true;
                cc.audioEngine.pauseAllEffects();
                cc.audioEngine.pauseMusic();
                cc.audioEngine.pauseAll();
                this.SoundBtn.children[0].getComponent(cc.Sprite).spriteFrame = this.SoundOff;
            }
            else
            {
                this.isSoundOn = true;
                this.GameMusic.getComponent(GameMusic).isPause = true;
                cc.audioEngine.resumeAllEffects();
                cc.audioEngine.resumeMusic();
                cc.audioEngine.resumeAll();
                this.SoundBtn.children[0].getComponent(cc.Sprite).spriteFrame = this.SoundOn;
            }
        }
        else
        {
            cc.log("There no sound effects or Sound engine not found ERROR!!!");
        }
    }

    start () 
    {
        this.GameMusic = cc.find("GameMusic");
        if(this.SoundBtn != null)
        {
            this.SoundBtn.children[0].getComponent(cc.Sprite).spriteFrame = this.SoundOn;
        }
    }

    // update (dt) {}
}
