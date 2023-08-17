import BossHealth from "../Boss/BossHealth";
import SingleEnemy from "../Enemies/SingleEnemy";
import EnemyBullet from "../EnemyBullet/EnemyBullet";
import HealthProgressBar from "../HealthBarScript/HealthBar";
import Meteorite from "../Meteorites/Meteotite";
import GlobalTime from "../OtherScript/GlobalDTime";
import PlayerBullet from "../PlayerBullet/PlayerBullet";
import BaseDataManager from "../UserData/DataManager";
import PlayerControler from "./PlayerController";
import PlayerStats from "./PlayerStats";
import SpaceShipManager from "./SpaceShipManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class HealthManager extends cc.Component 
{

    @property(cc.Float)
    MaxHealth = 20;
    @property(cc.Float)
    CurHealth = 0;
    @property(cc.Float)
    HP_Gen = 0.01;

    HealTimer = 1;

    @property(cc.Float)
    Def = 20;
    @property(cc.Float)
    Armor = 0;
    @property(cc.Float)
    MagicResist = 20;
    @property(cc.Boolean)
    isInvincible: boolean = false;
    @property(cc.Boolean)
    isDead: boolean = false;

    @property(cc.Node)
    HealthBar: cc.Node = null;

    @property(cc.CircleCollider)
    collider: cc.CircleCollider = null;

    // @property(cc.Prefab)
    // PlayerBulletPrefab: cc.Prefab = null;
    // @property(cc.Boolean)
    // canShoot: Boolean = true;
    // @property(cc.Float)
    // AtkSpeed = 0.4;
    // BlockShootTimer = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        this.collider = this.node.getComponent(cc.CircleCollider);
    }

    start() 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);
        cc.director.getCollisionManager().enabled = true;

        this.MaxHealth = PlayerStats.MaxHP;
        this.HP_Gen = PlayerStats.HP_Gennerate;
        this.CurHealth = this.MaxHealth;
        this.HealthBar.getComponent(HealthProgressBar).SetMaxHealth(this.MaxHealth);
        this.HealthBar.getComponent(HealthProgressBar).SetHealth(this.CurHealth);
        //this.schedule(this.Shooting, this.AtkSpeed);
    }

    onDestroy() 
    {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);
    }

    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        // console.log("Collide name: " + otherCollider.name);
        // console.log("Collide with: " + otherCollider);
        // console.log("Collide name: " + selfCollider.name);
        // console.log("Collide with: " + selfCollider);
        if(otherCollider.name == "Enemy<BoxCollider>")
        {
            this.ReceiveDmg(this.MaxHealth*1000);
        }
        if(otherCollider.name == "EnemyBullet<BoxCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(EnemyBullet).dmg);
            //this.BlockShootTimer = 2;
            //this.canShoot = false;
        }
        if(otherCollider.name == "EnemyBullet_PowerUp<BoxCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(EnemyBullet).dmg);
            //this.BlockShootTimer = 2;
            //this.canShoot = false;
        }
        if(otherCollider.name == "Meteo<CircleCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(Meteorite).Maxhealth);
        }
        if(otherCollider.name == "Boss<PolygonCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(BossHealth).MaxHealth);
        }    
    }

    public OnKeyPress(event: cc.Event.EventKeyboard)
    {
        if(event.keyCode == cc.macro.KEY.z)
        {
            this.ReceiveDmg(5);
        }
        if(event.keyCode == cc.macro.KEY.x)
        {
            this.Healing(3);
        }
    }

    public ReceiveDmg(dmg: number)
    {
        if(this.isInvincible)
        {
            dmg = 0;
        }
        else
        {
            dmg = dmg - dmg*(this.Def/(this.Def + 100));
        }
        this.CurHealth -= dmg;
        this.HealthBar.getComponent(HealthProgressBar).SetHealth(this.CurHealth >= 0? this.CurHealth : 0);
        console.log("Cur Health: "+ this.CurHealth);
    }

    public Healing(healAmount: number)
    {
        healAmount = healAmount * (100 + PlayerStats.HealMultiplier)/100;
        this.CurHealth = this.CurHealth+healAmount > this.MaxHealth? this.MaxHealth : this.CurHealth + healAmount;
        this.HealthBar.getComponent(HealthProgressBar).SetHealth(this.CurHealth);
        console.log("Cur Health: "+ this.CurHealth);
    }

    update(dt) 
    {
        if(this.CurHealth <= 0 && !this.isDead)
        {
            this.isDead = true;
            this.node.children[0].getComponent(cc.Animation).enabled = true;
            this.node.children[0].getComponent(cc.Animation).play();
            this.node.emit("PlayerDead", false);
            this.collider.enabled = false;
            this.scheduleOnce(this.DestroyPlayer, 0.25);
            console.log("Player Died");
        }
        // if(this.BlockShootTimer > 0)
        // {
        //     this.BlockShootTimer -= dt;
        // }
        // else
        // {
        //     this.canShoot = true;
        // }
        if(this.HealTimer > 0)
        {
            this.HealTimer -= dt*GlobalTime.TimeScale;
        }
        else
        {
            this.Healing(this.HP_Gen);
            this.HealTimer = 1;
        }
    }

    private DestroyPlayer()
    {
        this.node.active = false;
    }

    public RevivePlayer()
    {
        this.CurHealth = this.MaxHealth/2;
        this.collider.enabled = true;
        this.isDead = false;
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = this.node.getComponent(SpaceShipManager).curSprite;
        cc.warn("TEST " + this.node.children[0].getComponent(cc.Sprite).spriteFrame.name);
        this.node.children[0].getComponent(cc.Animation).enabled = false;
        this.node.getComponent(PlayerControler).fisrtTouch = true;
        this.node.emit("Revive", true);
    }

    // private Shooting()
    // {
    //     //console.log("Shooting");
    //     if(this.canShoot && this.PlayerBulletPrefab != null)
    //     {
    //         var scene = cc.director.getScene();
    //         var Bullet = cc.instantiate(this.PlayerBulletPrefab);
    //         Bullet.parent = scene;
    //         Bullet.setPosition(this.node.getPosition());
    //         Bullet.getComponent(PlayerBullet).SetShootDirection(cc.v2(this.node.up.x, this.node.up.y));
    //         // console.log("Bullet parent " + Bullet.parent.name);
    //         // console.log("Bullet size " + Bullet.getContentSize());
    //         // console.log("Bullet angle " + Bullet.angle);
    //         // console.log("Bullet scale " + Bullet.getScale(cc.v3()));
    //         // console.log("Bullet Info " + Bullet.getComponent(PlayerBullet).isNormalBehav);
    //     }    
    // }
}
