import PlayerStats from "../../Player/PlayerStats";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class IncreaseNumShotEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        if(PlayerStats.numOfShot < 5)
        {    
            PlayerStats.numOfShot = PlayerStats.numOfShot/1 + 1;
            PlayerStats.AtkSpeed = PlayerStats.AtkSpeed/1 * 0.75;
        }
        //cc.warn(PlayerStats.numOfShot);
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
