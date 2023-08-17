import Combo from "../Combo System/ComboSystem";
import SingleEnemy from "../Enemies/SingleEnemy";
import EnemyBullet from "../EnemyBullet/EnemyBullet";
import GlobalTime from "../OtherScript/GlobalDTime";
import PlayerStats from "../Player/PlayerStats";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerBullet extends cc.Component {

    @property(cc.Float)
    dmg = 1;

    @property(cc.Float)
    DistanceTravel = 0;

    @property(cc.Float)
    Speed = 5;

    @property(cc.Float)
    Accelerate = 2.5;

    @property(cc.Vec2)
    startPos: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    ExistTime = 10;

    @property(cc.Float)
    initialAngle = 0;

    @property(cc.Boolean)
    isNormalBehav: Boolean = true;

    @property(cc.Vec2)
    ShootDirection: cc.Vec2 = new cc.Vec2(0, 1);

    isCrit: boolean = false;
    Combo: cc.Node = null;

    canThrough: boolean = true;
    canBounce: boolean = true;
    numThrough = 0;
    numBounce = 0;

    public SetShootDirection(direct: cc.Vec2)
    {
        this.ShootDirection = direct;
    }

    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        //cc.log("Collide");
        if(otherCollider.name == "Enemy<BoxCollider>")
        {
            this.node.emit("ComboUp", true);
            this.DestroyBullet(true);
        }
        if(otherCollider.name == "EnemyBullet_PowerUp<BoxCollider>")
        {
            this.DestroyBullet(false);
        }
        if(otherCollider.name == "EnemyBullet<BoxCollider>" && 
            otherCollider.node.getComponent(EnemyBullet).isDestructible)
        {
            this.DestroyBullet(false);
        }
        if(otherCollider.name == "Meteo<CircleCollider>")
        {
            this.node.emit("ComboUp", true);
            this.DestroyBullet(true);
        }
        if(otherCollider.name == "Boss<PolygonCollider>")
        {
            this.node.emit("ComboUp", true);
            this.DestroyBullet(true);
        }
        if(otherCollider.name == "BoundaryLeft<BoxCollider>" ||
                otherCollider.name == "BoundaryRight<BoxCollider>" ||
                otherCollider.name == "BoundaryLow<BoxCollider>" ||
                otherCollider.name == "BoundaryUp<BoxCollider>")
        {
            this.DestroyBullet(false);
        }
    }

    public IncreaseCombo()
    {
        this.Combo.getComponent(Combo).setComboNum(true);
    }

    DestroyBullet(isHit: boolean = false)
    {
        this.Combo.getComponent(Combo).setComboNum(isHit);
        if(isHit && ((this.canBounce && this.numBounce > 0) || (this.canThrough && this.numThrough > 0)))
        {
            if(this.canBounce && this.numBounce > 0)
            {
                let angle = 0;
                this.numBounce = this.numBounce/1 - 1;
                if(Math.random() < 0.5)
                {
                    angle = 45;
                }
                else
                {
                    angle = -45;
                }
                this.node.angle = angle;
                this.SetShootDirection(cc.v2(this.node.up.x, this.node.up.y));
                this.numBounce = this.numBounce/1 - 1;
                this.dmg = this.dmg/1 * 0.667;
            }
            if(this.canThrough && this.numThrough > 0)
            {
                this.numThrough = this.numThrough/1 - 1;
                this.dmg = this.dmg/1 * 0.667;
            }
        }
        else
        {
            this.node.active = false;
        }    
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.Combo = cc.find("InGameMenu/Combo");
        //cc.warn("COMBO " + this.Combo);    
    }

    protected onEnable(): void 
    {
        this.Combo?.on("ComboUp", this.Combo.getComponent(Combo).setComboNum, this.Combo);
    }

    protected onDisable(): void 
    {
        this.Combo?.off("ComboUp", this.Combo.getComponent(Combo).setComboNum, this.Combo);
    }   

    protected onDestroy(): void 
    {
        cc.Tween.stopAllByTarget(this);
        this.node.destroy();
    }

    start () 
    {
        this.dmg = this.dmg * (PlayerStats.DmgMultiplier/1 + Combo.ComboDmg/1);
        this.numThrough = PlayerStats.numThrough;
        this.numBounce = PlayerStats.numBounce;
        if(Math.random() <= (PlayerStats.BaseCritRate/100 + PlayerStats.Luck/1000))
        {
            this.dmg = this.dmg * (1 + PlayerStats.BaseCritDmg/100);
            this.isCrit = true;
            this.node.setScale(2, 2);
        }

        // cc.warn("Crit rate " + (PlayerStats.BaseCritRate/100 + PlayerStats.Luck/1000));
        //cc.warn("DMG " + this.dmg);

        this.startPos = this.node.getPosition();
        this.initialAngle = this.node.angle;
        setTimeout(function() 
        {
            if(this.node != null)
            {
                //console.log("Destroy Bullet " + this.ExistTime);
                this.node.destroy(); 
            }         
        }.bind(this), (this.ExistTime*1000)/GlobalTime.TimeScale);
    }

    update(dt) 
    {
        if(cc.isValid(this.node) && cc.Vec2.distance(this.node.getPosition(), this.startPos) > this.DistanceTravel && this.DistanceTravel > 0)
        {
            //console.log("Destroy Bullet " + cc.Vec2.distance(this.node.getPosition(), this.startPos));
            this.node.destroy();
        }
        if(cc.isValid(this.node) && this.isNormalBehav)
        {  
            let Pos = new cc.Vec2();

            cc.Vec2.multiplyScalar(Pos, this.ShootDirection, this.Speed*dt*GlobalTime.TimeScale);
            this.node.getPosition().add(Pos, Pos);
            this.node.setPosition(Pos);

            //console.log("Where: " + this.node.getPosition());
            this.Speed += this.Accelerate * dt;
        }
        
    }
}
