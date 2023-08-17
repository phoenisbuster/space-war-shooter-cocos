const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectSystem extends cc.Component 
{
    @property(cc.Boolean)
    applyOnce: boolean = false;
    
    @property(cc.Boolean)
    isPermanent: boolean = false;

    @property(cc.Boolean)
    isEffStack: boolean = false;

    @property(cc.Float)
    Duration: number = 10;

    @property(cc.Boolean)
    isDurationStack: boolean = false;

    isActive = false;
    
    public InstanceEffect(target: cc.Node) {}

    public Tick(dt) {}

    public EndEffect() {}   
}
