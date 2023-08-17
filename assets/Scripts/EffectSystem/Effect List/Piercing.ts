import PlayerStats from "../../Player/PlayerStats";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PiercingEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        PlayerStats.numThrough = PlayerStats.numThrough/1 + 1;
        PlayerStats.numBounce = 0;
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
