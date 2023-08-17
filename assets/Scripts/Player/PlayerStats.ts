import ShootingManager from "../SpaceShip/ShootingManager";
import BaseDataManager from "../UserData/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerStats extends cc.Component {

    @property(cc.Integer)
    CurLevel = 0;

    @property(cc.Integer)
    OldLevel = 1;

    @property(cc.Float)
    Lv10Time = 5;
    CurLv10Time = 0;

    @property(cc.Boolean)
    isLv10: boolean = false;

    @property(cc.Node)
    Lv_Text: cc.Node = null;

    @property(cc.Node)
    Lv10_UI: cc.Node = null;

    static HP_Gennerate: number = 0.01;    //per sec, x10 one tick at new wave/round, stack additively
    static HealMultiplier: number = 0;     //percent unit, stack additively
    static Luck: number = 100;             //Luck over 1000 => Gacha or Increase Overall Crit Rate, stack additively
    static BaseCritRate: number = 1;       //percent unit, stack additively
    static BaseCritDmg: number = 120;      //percent unit, stack additively
    static ID: number = 3;
    static MaxHP: number = 20;
    static AtkSpeed: number = 2.5;
    static DmgMultiplier: number = 1;     //percent unit, stack additively
    static ArmorPen: number = 0;           //percent unit, stack additivelyData
    static Def: number = 10;  
    
    static numOfShot: number = 1;
    static numBounce: number = 0;
    static numThrough: number = 0;
    static comboParam: number = 1;
    static lifeCount: number = 1;
    static reroll: number = 1;

    // LIFE-CYCLE CALLBACKS:
    private LoadData()
    {
        let _dataPilot = BaseDataManager.internalGetUserData("PilotStat");
        let _dataShip = BaseDataManager.internalGetUserData("SpaceShipStat");

        PlayerStats.ID = _dataShip.ID;

        PlayerStats.MaxHP = _dataShip.MaxHP;
        PlayerStats.HP_Gennerate = _dataPilot.HP_Gennerate;
        PlayerStats.HealMultiplier = _dataPilot.HealMultiplier;
        PlayerStats.Def = _dataShip.Def;

        PlayerStats.AtkSpeed = _dataShip.AtkSpeed;
        PlayerStats.DmgMultiplier = _dataShip.DmgMultiplier;
        PlayerStats.ArmorPen = _dataShip.ArmorPen;

        PlayerStats.Luck = _dataPilot.Luck;
        PlayerStats.BaseCritRate = _dataPilot.BaseCritRate;
        PlayerStats.BaseCritDmg = _dataPilot.BaseCritDmg;

        PlayerStats.numOfShot = 1;
        PlayerStats.numThrough = 0;
        PlayerStats.numBounce = 0;
        PlayerStats.comboParam = 1;
        PlayerStats.lifeCount = 1;
        PlayerStats.reroll = 1;

        // cc.warn("PlayerStats ID: " + PlayerStats.ID);

        // cc.warn("PlayerStats MaxHP: " + PlayerStats.MaxHP);
        // cc.warn("PlayerStats HP_Gennerate: " + PlayerStats.HP_Gennerate);
        // cc.warn("PlayerStats Heal Increase: " + PlayerStats.HealMultiplier);
        // cc.warn("PlayerStats Def: " + PlayerStats.Def);
    
        // cc.warn("PlayerStats AtkSpeed: " + PlayerStats.AtkSpeed);
        // cc.warn("PlayerStats DmgMultiplier: " + PlayerStats.DmgMultiplier);
        // cc.warn("PlayerStats ArmorPen: " + PlayerStats.ArmorPen);
    
        // cc.warn("PlayerStats Luck: " + PlayerStats.Luck);
        // cc.warn("PlayerStats BaseCritRate: " + PlayerStats.BaseCritRate);
        // cc.warn("PlayerStats BaseCritDmg: " + PlayerStats.BaseCritDmg);
    }

    onLoad () 
    {
        this.LoadData();
    }

    start () 
    {
        this.Lv10_UI.active = false;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);
        this.SetLevel(11);
    }

    onDestroy() 
    {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);
    }

    public SetLevel(lvUp: number = 1, Ship: cc.Node = null)
    {
        if(this.OldLevel != this.CurLevel && lvUp != 0 && this.CurLevel != 10)
        {
            this.OldLevel = this.CurLevel;
        }
            
        if(lvUp == 1)
            this.CurLevel = this.CurLevel==10? 10 : this.CurLevel+1;
        else if(lvUp > 1 && lvUp <= 10)
            this.CurLevel = lvUp > this.CurLevel? lvUp : this.CurLevel;
        else if(lvUp > 10)
            this.CurLevel = 1;
        else if(lvUp == 0)
            this.CurLevel = this.OldLevel;
        else
            this.CurLevel = this.CurLevel==1? 1 : this.CurLevel-1;
        
        if(Ship == null)
        {
            //this.node.children[0].getComponent(ShootingManager).SetLevel(this.CurLevel);
            cc.log("Player Stats Init");
            this.node.children[0].getComponent(ShootingManager).SetLevel(this.CurLevel);

        }    
        else
        {
            //Ship.getComponent(ShootingManager).SetLevel(getComponent<PlayerStats>().CurLevel);
            cc.log("Player Stats " + Ship.name);
            Ship.getComponent(ShootingManager).SetLevel(this.CurLevel);
        }
            

        if(this.CurLevel == 10)
        {
            this.isLv10 = true;
            this.Lv10_UI.active = true;
            this.CurLv10Time = this.Lv10Time;
        }
        this.Lv_Text.getComponent(cc.Label).string = "Lv: " + this.CurLevel;
    }

    public SetlvDebug()
    {
        this.SetLevel(1);
    }

    public OnKeyPress(event: cc.Event.EventKeyboard)
    {
        if(event.keyCode == cc.macro.KEY.shift)
        {
            this.SetlvDebug();
        }
    }

    update (dt) 
    {
        if(this.CurLv10Time > 0 && this.isLv10)
        {
            cc.log("Cur lv 10 time: " + this.CurLv10Time);
            cc.log("Is Image active " + this.Lv10_UI.activeInHierarchy);
            this.CurLv10Time -= dt;
            if(this.Lv10_UI.activeInHierarchy)
            {
                cc.log("Image: " + this.CurLv10Time/this.Lv10Time);
                this.Lv10_UI.getComponent(cc.Sprite).fillRange = this.CurLv10Time/this.Lv10Time;
            }
                
        }
        else if(this.CurLv10Time <= 0 && this.isLv10)
        {
            this.isLv10 = false;
            this.Lv10_UI.active = false;
            this.SetLevel(0);
        }
        else if(!this.isLv10)
        {
            this.Lv10_UI.active = false;
        }
    }
}
