import EffectSystem from "../EffectSystem/EffectManager";
import GlobalTime from "../OtherScript/GlobalDTime";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuffManager extends cc.Component {

    @property(cc.SpriteFrame)
    Icon: cc.SpriteFrame = null;

    @property(cc.String)
    tooltip: string = 'Fill the effect of tooltip here';

    @property(cc.Prefab)
    EffectPrefab: cc.Prefab = null;

    Effect: EffectSystem = null;

    BuffedTarget: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.setTarget(cc.find("Player"))
    }

    public setTarget(target: cc.Node)
    {
        this.BuffedTarget = target;
    }

    public setEffect()
    {
        this.Effect = this.EffectPrefab.data.getComponent(EffectSystem);
        //cc.warn("CHECK EFFECT " + (this.Effect == null));
    }

    public ApplyEffect()
    {
        this.Effect.isActive = this.Effect.applyOnce? false : true;
        this.Effect.InstanceEffect(this.BuffedTarget);
        //this.schedule(() => {this.Effect.InstanceEffect(this.BuffedTarget)}, 0, 3);
    }

    start () 
    {
        if(this.EffectPrefab)
        {
            this.setEffect();
        }
        this.ApplyEffect();
    }

    update (dt) 
    {
        if(this.Effect.isActive)
        {
            if(this.Effect.Duration > 0)
            {
                let count = this.Effect.isPermanent? 0 : dt * GlobalTime.TimeScale;
                this.Effect.Duration -= count;
                this.Effect.Tick(count);
            }
            else
            {
                this.Effect.EndEffect();
                this.Effect.isActive = false;
                this.schedule(()=>{
                    this.node.destroy();
                }, 0.25);
            }
        }
        else
        {
            this.node.destroy();
        }
    }
}
