import Combo from "../Combo System/ComboSystem";
import GlobalTime from "../OtherScript/GlobalDTime";
import { HealthManager } from "../Player/HealthManager";
import PlayerControler from "../Player/PlayerController";
import PlayerStats from "../Player/PlayerStats";
import PlayerBullet from "../PlayerBullet/PlayerBullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GunManager extends cc.Component {

    @property(cc.Prefab)
    ShootingScript: cc.Prefab = null;

    @property(cc.Node)
    playerBullet: cc.Node = null;

    @property(cc.Integer)
    numOfShot = 1;

    @property(cc.Float)
    TimeBetShot = 0.25;

    @property(cc.Float)
    UpgradeLv = 1;

    @property(cc.Float)
    FireRate = 0.5;

    @property(cc.Float)
    BulletSpeed = 10;

    @property(cc.Float)
    BulletDist = 50;

    @property(cc.Float)
    MaxAttributeUpgrade = 1;

    @property(cc.Float)
    AttackSpeed = 1;

    @property(cc.Float)
    AtkSpeedPerLv = 0.05;    
    curAtkSpeed: number = 1;
    MaxTimer = 0;
    Timer = 0;

    @property(cc.Boolean)
    canShoot: boolean = false;

    Player: cc.Node = null;
    beginShoot = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        this.Player = cc.find("Player");
        this.SetBeginShoot(this.Player.getComponent(PlayerControler).fisrtTouch);
    }

    start () 
    {
        this.FireRate = 1/(PlayerStats.AtkSpeed/1 + Combo.ComboAtkSpeed/1);
        this.numOfShot = PlayerStats.numOfShot;
        //cc.warn("ATK SPEED " + this.FireRate);
        if(this.ShootingScript == null)
        {
            //this.schedule(this.Shooting, this.FireRate / this.curAtkSpeed);
            this.MaxTimer = this.FireRate / this.curAtkSpeed;
            this.Timer = this.MaxTimer;
        }    
        else
        {
            //this.ShootingScript = this.node.getComponent(ShootAround);
            // ShootingScript.playerBullet = playerBullet;
            // ShootingScript.UpgradeLv = UpgradeLv;
            // ShootingScript.FireRate = FireRate;
            // ShootingScript.BulletSpeed = BulletSpeed;
            // ShootingScript.BulletDist = BulletDist;
            // ShootingScript.MaxAttributeUpgrade = MaxAttributeUpgrade;
            // ShootingScript.AttackSpeed = AttackSpeed;
            // ShootingScript.AtkSpeedPerLv = AtkSpeedPerLv;
            // ShootingScript.canShoot = canShoot;
            // ShootingScript.ShootingSound = ShootingSound;
            // ShootingScript.ShootCommand();
        }
    }

    protected onEnable(): void 
    {
        this.Player?.on("BeginMatch", this.SetBeginShoot, this);
        this.Player?.on("MatchEnd", this.SetBeginShoot, this);  
        this.Player?.on("Revive", this.SetBeginShoot, this);  
    }

    protected onDestroy(): void {
        this.Player?.off("BeginMatch", this.SetBeginShoot, this);
        this.Player?.off("MatchEnd", this.SetBeginShoot, this); 
        this.Player?.off("Revive", this.SetBeginShoot, this); 
    }

    public SetBeginShoot(isBegin: boolean = true)
    {
        //cc.warn("SET HERE " + isBegin);
        this.beginShoot = isBegin;
    }

    public SetBullet(Bullet: cc.Node)
    {
        this.playerBullet = Bullet;
        if(this.ShootingScript != null)
        {
            //this.ShootingScript.playerBullet = Bullet;
        }
    }
    public SetAttckSpeed(LvUpgrade: number)
    {
        this.curAtkSpeed = this.AttackSpeed*(1 + this.AtkSpeedPerLv*LvUpgrade);
        this.MaxTimer = this.FireRate / this.curAtkSpeed;
        if(this.ShootingScript != null)
        {
            //this.ShootingScript.AttackSpeed = curAtkSpeed;
        }
    }
    public SetCanShoot(value: boolean)
    {
        this.canShoot = value;
        if(this.ShootingScript != null)
        {
            //this.ShootingScript.canShoot = value;
        }
    }

    private ShotInterval()
    {
        //cc.log("Begin to Shot");
        if(this.numOfShot > 1)
        {
            this.TimeBetShot = 0.1;
            this.schedule(this.Shooting, this.TimeBetShot, this.numOfShot/1-1);
        }
        else
        {
            this.scheduleOnce(this.Shooting);
        }    
    }

    private Shooting()
    {
        //cc.log("Yes2 " + (this.playerBullet != null));
        if(this.playerBullet != null)
        {
            //cc.log("Yes2 " + this.canShoot + " " + !this.node.parent.parent.getComponent(HealthManager).isDead);
            if(this.beginShoot && 
                this.canShoot && 
                !this.node.parent.parent.getComponent(HealthManager).isDead &&
                this.node.parent.parent.getComponent(PlayerControler).allowShot)
            {
                var scene = cc.director.getScene();
                var Bullet = cc.instantiate(this.playerBullet);
                Bullet.parent = scene;
                Bullet.setPosition(this.node.parent.parent.convertToWorldSpaceAR(this.node.getPosition(), cc.v2()));
                Bullet.angle = this.node.angle;
                Bullet.getComponent(PlayerBullet).DistanceTravel = this.BulletDist + 
                                                                    this.BulletDist * 0.15*this.MaxAttributeUpgrade;
                Bullet.getComponent(PlayerBullet).Speed = this.BulletSpeed + 
                                                            this.BulletSpeed * 0.25 * this.MaxAttributeUpgrade;
                Bullet.getComponent(PlayerBullet).SetShootDirection(cc.v2(this.node.up.x, this.node.up.y));
                //cc.log("Shoot Direct " + cc.v2(this.node.up.x, this.node.up.y));
                //cc.warn("Angle " + Bullet.angle);
            }
            this.Timer = this.MaxTimer;
        }
    }

    update(dt) 
    {
        //cc.log("Timer to shot " + this.Timer);
        if(this.Timer <= 0)
        {
            //cc.log("Ready to Shot");
            this.ShotInterval();
            this.FireRate = 1/(PlayerStats.AtkSpeed/1 + Combo.ComboAtkSpeed/1);
            this.MaxTimer = this.FireRate / this.curAtkSpeed;
            this.Timer = this.MaxTimer;
        }
        else
        {
            this.Timer -= dt*GlobalTime.TimeScale;
        }

        if(this.numOfShot != PlayerStats.numOfShot)
        {
            this.numOfShot = PlayerStats.numOfShot;
        }
    }
}
