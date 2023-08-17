import PlayerStats from "../../Player/PlayerStats";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelUpEff extends  EffectSystem{

    public InstanceEffect(target: cc.Node)
    {
        if(this.applyOnce && target.name == "Player")
        {
            target?.getComponent(PlayerStats).SetlvDebug();
        }
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
