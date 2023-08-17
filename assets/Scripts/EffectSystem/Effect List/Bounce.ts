import PlayerStats from "../../Player/PlayerStats";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BounceEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        PlayerStats.numBounce = PlayerStats.numBounce/1 + 1;
        PlayerStats.numThrough = 0;
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
