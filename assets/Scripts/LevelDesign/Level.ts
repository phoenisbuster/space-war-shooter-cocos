import Wave from "./Wave";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelSetting extends cc.Component 
{
    //[Header("Back Ground")]
    @property(cc.SpriteFrame)
    BG_Image: cc.SpriteFrame = null;
    
    //[Header("Difficulty of this Level")]
    @property(cc.Boolean)
    isStrongerEachWave: boolean = false;
    @property(cc.Float)
    statMultipler: number = 1.0;

    //[Header("Properties for Meteorites of this Level")]
    @property(cc.Float)
    MeteoriteGenSpeed = 0.1;
    @property(cc.Float)
    maxInterval = 10;
    @property(cc.Float)
    minInterval = 20;
    @property(cc.Float)
    maxSize = 1;
    @property(cc.Float)
    minSize = 0.25;

    //[Header("Properties for Item Drop Rate")]
    @property(cc.Float)
    PowerUpRate = 15;
    @property(cc.Float)
    ChangeSpaceShipRate = 15;
    @property(cc.Float)
    HealthRate = 10;
    @property(cc.Float)
    MoneyRate = 50;

    @property([Wave])
    WaveList: Wave[] = [];   
}
