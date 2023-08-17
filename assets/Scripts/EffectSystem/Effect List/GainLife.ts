import PlayerStats from "../../Player/PlayerStats";
import SpaceShipManager from "../../Player/SpaceShipManager";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GainLifeEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        PlayerStats.lifeCount = PlayerStats.lifeCount/1 + 1;
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
