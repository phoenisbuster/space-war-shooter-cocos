import PlayerStats from "../../Player/PlayerStats";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AtkSpeedEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        PlayerStats.BaseCritRate = PlayerStats.BaseCritRate/1 + 3;
        PlayerStats.BaseCritDmg = PlayerStats.BaseCritDmg/1 + 6;
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
