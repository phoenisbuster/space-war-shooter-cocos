import GlobalTime from "../OtherScript/GlobalDTime";
import { HealthManager } from "../Player/HealthManager";
import PlayerBullet from "../PlayerBullet/PlayerBullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Meteorite extends cc.Component {

    @property(cc.Float)
    existTime = 15;
    
    @property(cc.Integer)
    angle = 360;

    @property(cc.Float)
    Speed = 200;

    @property(cc.Float)
    Accelerate = 10;

    @property(cc.Vec2)
    MoveDirect: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    Maxhealth = 1;

    @property(cc.Float)
    Curhealth = 1;

    @property(cc.Boolean)
    isDestroyed = false;

    @property(cc.Boolean)
    outOfBound = false;

    @property(cc.AudioSource)
    DestroyAudio: cc.AudioSource = null;

    @property(cc.Prefab)
    ExplEffect: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        //cc.log("Collide");
        if(otherCollider.name == "Player<CircleCollider>")
        {
            this.Curhealth -= otherCollider.getComponent(HealthManager).MaxHealth;
        }
        if(otherCollider.name == "PlayerBullet<BoxCollider>")
        {
            this.Curhealth -= otherCollider.getComponent(PlayerBullet).dmg;
        }
    }

    public SetMaxHealth(scale: number, statMultipler: number = 1)
    {
        if(scale < 0.25)
        {
            this.Maxhealth = 10;
        }
        else if(scale >= 0.25 && scale < 0.5)
        {
            this.Maxhealth = 20;
        }
        else if(scale >= 0.5 && scale < 0.75)
        {
            this.Maxhealth = 30;
        }
        else if(scale >= 0.75 && scale < 1)
        {
            this.Maxhealth = 40;
        }
        else
        {
            this.Maxhealth = 50;
        }
        this.Maxhealth = this.Maxhealth * statMultipler;
        this.Curhealth = this.Maxhealth;
    }

    public SetMoveDirect(value: cc.Vec2 = cc.v2(0,1))
    {
        this.MoveDirect = value;
    }

    // onLoad () {}

    start () 
    {
        let i = 1;
        if(Math.random() < 0.5)
        {
            i = -1;
        }
        cc.tween(this.node).by(4, {angle: i*this.angle}).repeatForever().start();
        setTimeout(function() 
        {
            this.OutOfBound();  
        }.bind(this), this.existTime*1000);
    }

    public OutOfBound()
    {
        if(this.node != null)
        {
            this.outOfBound = true;
            this.Curhealth = 0;
            //cc.warn("Meteo Time Out " + this.Curhealth);
            //this.node.destroy(); 
        } 
    }

    update (dt) 
    {
        if(this.Curhealth <= 0 && !this.isDestroyed)
        {
            this.isDestroyed = true;
            this.node.getComponent(cc.CircleCollider).enabled = false;
            this.node.getComponent(cc.Sprite).enabled = false;
            this.node.emit("MeteoDestroy", this.node.getPosition(),!this.outOfBound);
            if(this.ExplEffect && !this.outOfBound)
            {
                let expl = cc.instantiate(this.ExplEffect);
                expl.getComponent(cc.ParticleSystem).speed = this.node.scaleX * 300;
                expl.parent = cc.director.getScene();
                expl.setPosition(this.node.getPosition());
                setTimeout(function() 
                {
                    expl.destroy();  
                }.bind(this), 1000);
                //cc.warn("ALO " + expl.getComponent(cc.ParticleSystem).speed);
            }
            this.scheduleOnce(this.DestroyObj, 0.25);
        }
        else
        {
            //cc.warn("WHAT HAPPEN " + this.Curhealth);
        }
        if(cc.isValid(this.node) && !this.isDestroyed)
        {  
            let Pos = new cc.Vec2();

            cc.Vec2.multiplyScalar(Pos, this.MoveDirect, this.Speed*dt*GlobalTime.TimeScale);
            this.node.getPosition().add(Pos, Pos);
            this.node.setPosition(Pos);

            //console.log("Where: " + this.node.getPosition());
            this.Speed += this.Accelerate * dt;
        }
    }

    private DestroyObj()
    {
        //cc.warn("Meteo Destroy End");
        this.node.destroy();
    }
}
