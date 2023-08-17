import GlobalTime from "../OtherScript/GlobalDTime";
import PlayerStats from "../Player/PlayerStats";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Combo extends cc.Component {

    @property(cc.Node)
    Player: cc.Node = null;

    @property(cc.Float)
    existTime = 5;

    curExistTime = 0;

    comboNum = 0;
    comboDisplay = 0;

    static ComboDmg: number = 0;
    static ComboAtkSpeed: number = 0

    checkpoint = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.Player = cc.find("Player");
        this.curExistTime = this.existTime;
    }

    setComboNum(isHit: boolean)
    {
        let valueUp = isHit? 1 : 0;
        this.comboNum += this.comboNum < 1000? valueUp * PlayerStats.comboParam : 0;
        this.comboDisplay = Math.floor(this.comboNum);
        this.curExistTime = isHit? this.existTime : this.curExistTime;
        //cc.warn("HIT " + this.comboNum);
    }

    displayCombo()
    {
        if(this.comboDisplay >= 1)
        {
            this.setScale(true);
        }
        this.node.children[1].getComponent(cc.Label).string = "" + this.comboDisplay;
    }

    resetCombo()
    {
        this.comboNum = 0;
        this.comboDisplay = 0;
        this.setScale(false);
        this.curExistTime = -1;
        Combo.ComboDmg = 0;
        Combo.ComboAtkSpeed = 0;
    }

    setScale(isDisplay: boolean, duration: number = 0.5)
    {
        if(isDisplay)
        {
            this.node.setScale(1, 1);
        }
        else
        {
            cc.tween(this.node).to(duration, {
                scale: 0
            }).start();
            //this.node.setScale(0, 0);
        }
    }

    ComboGift(type: number)
    {
        //cc.warn("TYPE GIFT " + type);
        switch(type)
        {
            case 0:
                Combo.ComboDmg = Combo.ComboDmg/1 + 0.01;
                break;
            case 1:
                Combo.ComboAtkSpeed = Combo.ComboAtkSpeed/1 + 0.015;
                break;
            case 2:
                this.Player.getComponent(PlayerStats).SetlvDebug();
                break;
            default:
                break;
        }
    }

    start () 
    {
        this.setScale(false, 0);
    }

    update (dt) 
    {
        if(this.curExistTime > 0)
        {
            this.curExistTime -= dt * GlobalTime.TimeScale;
            this.node.getComponent(cc.Sprite).fillRange = -this.curExistTime/this.existTime;
            this.displayCombo();
        }
        else if(this.curExistTime <= 0 && this.curExistTime > -1)
        {
            this.resetCombo();
        }
        
        if(this.comboNum >= 1 && this.comboNum % 10 == 0 && this.checkpoint != this.comboNum)
        {
            this.checkpoint = this.comboNum;
            if(this.comboNum % 500 == 0)
            {
                this.ComboGift(2);
            }
            else
            {
                this.ComboGift((this.comboNum / 10) % 2);
            }
        }
    }
}
