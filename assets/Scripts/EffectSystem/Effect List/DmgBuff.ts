import PlayerStats from "../../Player/PlayerStats";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AtkSpeedEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        PlayerStats.DmgMultiplier = PlayerStats.DmgMultiplier/1 + 0.05;
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
