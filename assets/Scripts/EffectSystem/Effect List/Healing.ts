import { HealthManager } from "../../Player/HealthManager";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HealingEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        if(this.applyOnce && target.name == "Player")
        {
            target?.getComponent(HealthManager).Healing(10);
        }
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
