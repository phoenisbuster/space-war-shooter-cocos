import HealthProgressBar from "../HealthBarScript/HealthBar";
import { HealthManager } from "../Player/HealthManager";
import PlayerStats from "../Player/PlayerStats";
import PlayerBullet from "../PlayerBullet/PlayerBullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BossHealth extends cc.Component {

    @property(cc.Boolean)
    isInvincible: boolean = false;
    //[Header("Stats")]

    @property(cc.Float)
    MaxHealth = 1000;
    @property(cc.Float)
    CurHealth = 0;
    @property(cc.Float)
    OriginDef = 10;
    @property(cc.Float)
    CurDef = 0;
    @property([cc.Float])
    changePhraseAt: number[] = [];
    @property(cc.Integer)
    PhraseIndex = 0;

    @property(cc.Node)
    HealthBar: cc.Node = null;
    @property(cc.Boolean)
    isDead: boolean = false;

    @property(cc.Animation)
    explosionEffect: cc.Animation = null;
    // public static Action newPhrase;
    // public static Action<float> setDifficulty;

    // LIFE-CYCLE CALLBACKS:

    public onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider)
    {
        if(otherCollider.name == "Player<CircleCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(HealthManager).MaxHealth);
        }
        if(otherCollider.name == "PlayerBullet<BoxCollider>")
        {
            this.ReceiveDmg(otherCollider.node.getComponent(PlayerBullet).dmg * this.DmgMultiplier());
        }
    }

    private ReceiveDmg(dmg: number)
    {
        if(this.isInvincible)
        {
            dmg = 0;
        }
        this.CurHealth -= dmg;
        this.HealthBar.getComponent(HealthProgressBar).SetHealth(this.CurHealth >= 0? this.CurHealth : 0);
        if(this.PhraseIndex < this.changePhraseAt.length && 
            this.CurHealth <= this.MaxHealth*this.changePhraseAt[this.PhraseIndex]/100)
        {
            this.PhraseIndex++;
            this.node.emit("NewPhase");
            //newPhrase?.Invoke();
        }
    }

    public DmgMultiplier(): number
    {
        let calDef = this.CurDef * (1 - PlayerStats.ArmorPen/100);
        return 1 - (calDef/(calDef+100));
    }

    public SetHealthBar(bar: cc.Node, statMultipler: number = 1)
    {
        this.HealthBar = bar;
        this.HealthBar.active = true;
        this.MaxHealth = this.MaxHealth*statMultipler;
        this.CurHealth = this.MaxHealth;
        this.HealthBar.getComponent(HealthProgressBar).SetMaxHealth(this.MaxHealth);
        this.HealthBar.getComponent(HealthProgressBar).SetHealth(this.CurHealth);
        this.node.emit("SetDifficulty", statMultipler);
        //setDifficulty?.Invoke(statMultipler);
    }

    onLoad() 
    {
        this.CurDef  = this.OriginDef;
        this.explosionEffect = this.node.getComponent(cc.Animation);
    }

    start () 
    {

    }

    update(dt)
    {
        if(this.CurHealth <= 0 && !this.isDead)
        {
            this.isDead = true;
            //anim.SetBool("expl", true);
            this.node.getComponent(cc.Sprite).enabled = false;
            this.node.getComponent(cc.PolygonCollider).enabled = false;
            this.HealthBar.active = false;
            //callWhenDead?.Invoke(transform.position);
            this.node.emit("BossDead", this.node.getPosition());
            //StartCoroutine(DestroyThisObj());
            if(this.explosionEffect != null)
            {
                //cc.warn("Explosion" + this.explosionEffect);
                this.explosionEffect.play();
            }
            this.scheduleOnce(this.DestroyThisObj, 0.25);
        }
        else
        {
            this.CurDef = this.OriginDef + 
                            this.OriginDef * (this.MaxHealth - this.CurHealth)/(this.MaxHealth*0.1);
        }
    }

    private DestroyThisObj()
    {
        this.node.destroy();
    }
}
