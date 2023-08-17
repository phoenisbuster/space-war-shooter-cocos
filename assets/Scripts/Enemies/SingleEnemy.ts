import EnemyBullet from "../EnemyBullet/EnemyBullet";
import GlobalTime from "../OtherScript/GlobalDTime";
import { HealthManager } from "../Player/HealthManager";
import PlayerStats from "../Player/PlayerStats";
import PlayerBullet from "../PlayerBullet/PlayerBullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SingleEnemy extends cc.Component {

    @property(cc.Integer)
    EnemyID = -1;
    
    @property(cc.Float)
    MaxHealth = 20;
    @property(cc.Float)
    CurHealth = 0;
    @property(cc.Float)
    Def = 20;
    @property(cc.Float)
    Armor = 0;
    @property(cc.Float)
    MagicResist = 20;

    @property(cc.Boolean)
    isDead: boolean = false;


    @property(cc.BoxCollider)
    collider: cc.BoxCollider = null;

    @property([cc.Prefab])
    EnemyBulletPrefab: cc.Prefab[] = [];
    @property(cc.Float)
    ShotRate = 50;
    @property(cc.Float)
    AtkSpeed = 0.4;
    @property(cc.Integer)
    NumOfShot = 1;
    @property(cc.Float)
    ShotCheckTimer = 1;
    @property(cc.Float)
    MinShotCheckTimer = 0.1;

    @property(cc.Boolean)
    outOfBound: boolean = false;
    @property(cc.Boolean)
    isGenerating: boolean = true;
    
    Timer: number = 0;
    bulletIdx: number = 0;
    ShootDirect: cc.Vec2 = cc.Vec2.ZERO;

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        //this.SetInitialStats();
        this.collider = this.node.getComponent(cc.BoxCollider);
        
        // console.log("Init Enemy ShotDirect: "+ this.ShootDirect);
        // console.log("Init Enemy Max Health: "+ this.MaxHealth);
        // console.log("Init Enemy Cur Health: "+ this.CurHealth);
    }

    start() 
    {
        //cc.director.getPhysicsManager().enabled = true;
        this.Timer = this.ShotCheckTimer;
        //this.schedule(this.Shooting, this.AtkSpeed);
    }

    public SetInitialStats(statMultipler: number = 1)
    {
        this.ShootDirect = cc.v2(this.node.up.x, this.node.up.y);
        this.MaxHealth = this.MaxHealth * statMultipler;
        this.CurHealth = this.MaxHealth;
        this.ShotRate = this.ShotRate*statMultipler > 100? 100 : this.ShotRate*statMultipler;
        this.ShotCheckTimer = this.ShotCheckTimer/statMultipler < this.MinShotCheckTimer? 
                                this.MinShotCheckTimer : this.ShotCheckTimer/statMultipler;
    }

    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        if(otherCollider.name == "Player<CircleCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(HealthManager).MaxHealth);
        }
        if(otherCollider.name == "PlayerBullet<BoxCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(PlayerBullet).dmg);
        }
        if(otherCollider.name == "BoundaryLeft<BoxCollider>" && !this.isGenerating)
        {
            this.node.emit("ChangeDirection", 1);
        }
        if(otherCollider.name == "BoundaryRight<BoxCollider>" && !this.isGenerating)
        {
            this.node.emit("ChangeDirection", -1);
        }
    }

    public onCollisionExit(otherCollider: cc.Collider, selfCollider: cc.Collider) 
    {
        if(otherCollider.name == "BoundaryLow<BoxCollider>" && !this.isGenerating)
        {
            this.outOfBound = true;
            this.CurHealth = 0;
        }
    }

    public ReceiveDmg(dmg: number)
    {
        let curDef = this.Def * (1 - PlayerStats.ArmorPen/100);

        dmg = dmg - dmg*(curDef/(curDef + 100));
        this.CurHealth -= dmg;
    }

    public Healing(healAmount: number)
    {
        this.CurHealth = this.CurHealth+healAmount > this.MaxHealth? this.MaxHealth : this.CurHealth + healAmount;
    }

    update(dt) 
    {
        if(cc.isValid(this.node) && this.CurHealth <= 0 && !this.isDead)
        {
            this.isDead = true;
            if(!this.outOfBound)
            {
                this.node.getComponent(cc.Animation).play();
            }
            this.node.emit(
                "EnemyDead", 
                this.EnemyID, 
                !this.outOfBound,
                this.node.getPosition());
            this.scheduleOnce(this.DestroyPlayer, 0.25);
            this.collider.enabled = false;
            //console.log("Enemy Died");
        }

        if(cc.isValid(this.node) && this.Timer > 0)
        {
            this.Timer -= dt * GlobalTime.TimeScale;
        }
        else if(cc.isValid(this.node) && this.Timer <= 0)
        {
            if(Math.random() <= this.ShotRate/100)
            {
                this.bulletIdx = Math.floor(Math.random() * this.EnemyBulletPrefab.length);
                cc.log("Bullet index " + this.bulletIdx);
                this.schedule(this.Shooting, this.AtkSpeed, this.NumOfShot);
            }
            this.Timer = this.ShotCheckTimer;
        }
    }

    private DestroyPlayer()
    {
        this.node.destroy();
    }

    private Shooting()
    {
        if(cc.isValid(this.node) && !this.isDead)
        {
            this.Timer = this.ShotCheckTimer;
            
            var scene = cc.director.getScene();
            var Bullet = cc.instantiate(this.EnemyBulletPrefab[this.bulletIdx]);

            Bullet.parent = scene;

            if(this.isGenerating)
            {
                Bullet.setPosition(this.node.getPosition());
            }
            else
            {
                Bullet.setPosition(this.node.parent.parent.convertToWorldSpaceAR(
                                    this.node.parent.getPosition(), 
                                    cc.v2())
                );
            }
            //Bullet.setPosition(this.node.getPosition());

            //cc.log("Bullet Parent Name: " + this.node.parent.parent.name);

            
            //Bullet.angle = this.node.angle;

            Bullet.getComponent(EnemyBullet).SetShootDirection(this.ShootDirect);//cc.v2(this.node.up.x, this.node.up.y));
        }    
    }
}
