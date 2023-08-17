import SpaceShipManager from "../../Player/SpaceShipManager";
import EffectSystem from "../EffectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChangeShipEff extends EffectSystem {

    public InstanceEffect(target: cc.Node)
    {
        if(this.applyOnce && target.name == "Player")
        {
            target?.getComponent(SpaceShipManager).SetSpaceShipDebug();
        }
    }

    public Tick(dt) {}

    public EndEffect() {} 
}
