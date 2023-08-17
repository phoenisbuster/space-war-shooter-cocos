const {ccclass, property} = cc._decorator;

@ccclass
export default class HealthProgressBar extends cc.Component {

    @property
    isScale: boolean = false;
    @property(cc.Float)
    MaxHealth = 20;
    @property(cc.Float)
    CurHealth = 0;
    @property(cc.Node)
    HeartUI: cc.Node = null;

    public SetMaxHealth(health: number)
    {
        this.MaxHealth = health;
        if(this.isScale)
        {
            let scale = this.MaxHealth/20 <= 2.5? this.MaxHealth/20 : 2.5;
            this.node.setScale(new cc.Vec2(scale, 1));
            this.HeartUI.setScale(new cc.Vec2(1/scale, 1));
        }
        else
        {
            this.node.children[0].getComponent(cc.ProgressBar).progress = 1;
        }       
    }

    public SetHealth(health: number)
    {
        if(health < 0)
        {
            this.CurHealth = health <= this.MaxHealth? health : this.MaxHealth;
        }
        this.CurHealth = health <= this.MaxHealth? health : this.MaxHealth;
        this.node.children[0].getComponent(cc.ProgressBar).progress = this.CurHealth/this.MaxHealth;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        if(this.HeartUI == null)
        {
            this.HeartUI = this.node.children[0].children[1];
        }    
    }

    start () 
    {

    }

    // update (dt) {}
}
