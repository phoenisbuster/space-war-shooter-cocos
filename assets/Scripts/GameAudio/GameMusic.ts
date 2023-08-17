import BaseDataManager from "../UserData/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMusic extends cc.Component {

    @property([cc.AudioClip])
    MusicList: cc.AudioClip[] = [];

    @property(cc.AudioSource)
    MusicSource: cc.AudioSource = null

    isPause: boolean = false;

    onLoad()
    {
        this.MusicSource = this.node.getComponent(cc.AudioSource);
    }

    start () 
    {
        this.MusicSource.clip = this.MusicList[0];
        cc.audioEngine.playMusic(this.MusicSource.clip, false);
    }

    ChangeMusic()
    {
        let index = Math.floor(Math.random() * ((this.MusicList.length-1) - 0 + 1) + 0);
        this.PlayMusic(index);
    }

    PlayMusic(index: number)
    {
        cc.audioEngine.stopMusic();
        this.MusicSource.clip = this.MusicList[index];
        cc.audioEngine.playMusic(this.MusicSource.clip, false);
    }

    update(deltaTime: number) 
    {
        if(!cc.audioEngine.isMusicPlaying() && !this.isPause)
        {
            this.ChangeMusic();
        }
        // this.isPause = !BaseDataManager.internalGetUserData("SettingData").ToggleMusic;
        // if(this.isPause)
        // {
        //     cc.audioEngine.pauseMusic();
        // }
    }
}
