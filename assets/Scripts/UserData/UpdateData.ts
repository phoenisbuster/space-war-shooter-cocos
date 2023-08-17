import { DropDownBox } from "../Learning/DropDown/DropDownBox";
import SpaceShipManager from "../Player/SpaceShipManager";
import BaseDataManager from "./DataManager";
import { ItemData, PilotStat, PlayerData, SettingData, SpaceShipStat, SupportData, TalentData } from "./UserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{

    DopdownBox: cc.Node = null;
    text: string = "";

    @property(cc.Node)
    item: cc.Node = null;

    PilotData: cc.Node = null;
    ShipData: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {    
        this.DopdownBox = this.node.children[2];
        this.PilotData = this.node.children[0];
        this.ShipData = this.node.children[1];
        this.text = this.DopdownBox.getComponent(DropDownBox).SelectLabel.string;
        this.CreateInstanceClass(this.text);
    }

    start () 
    {
        this.DisplayData();
    }

    DisplayData()
    {
        let pilot = BaseDataManager.internalGetUserData("PilotStat");
        for(let i = 0; i < this.PilotData.childrenCount; i++)
        {
            let defaultVal = "";
            switch(i)
            {
                case 0:
                    defaultVal = pilot.HP_Gennerate;
                    break;
                case 1:
                    defaultVal = pilot.HealMultiplier;
                    break;
                case 2:
                    defaultVal = pilot.Luck;
                    break;
                case 3:
                    defaultVal = pilot.BaseCritRate;
                    break;
                case 4:
                    defaultVal = pilot.BaseCritDmg;
                    break;
            }
            this.PilotData.children[i].getComponent(cc.EditBox).placeholder = defaultVal;
        }

        let ship = BaseDataManager.internalGetUserData("SpaceShipStat");
        for(let i = 0; i < this.ShipData.childrenCount; i++)
        {
            let defaultVal = "";
            switch(i)
            {
                case 0:
                    defaultVal = ship.ID;
                    break;
                case 1:
                    defaultVal = ship.MaxHP;
                    break;
                case 2:
                    defaultVal = ship.AtkSpeed;
                    break;
                case 3:
                    defaultVal = ship.DmgMultiplier;
                    break;
                case 4:
                    defaultVal = ship.ArmorPen;
                    break;
                case 5:
                    defaultVal = ship.Def;
                    break;
            }
            this.ShipData.children[i].getComponent(cc.EditBox).placeholder = defaultVal;
        }
    }

    CreateInstanceClass(_class_name: string)
    {
        this.DisplayData();
        switch(_class_name)
        {
            case "SettingData":
                this.PilotData.active = false;
                this.ShipData.active = false;
                break;
            case "ItemData":
                this.PilotData.active = false;
                this.ShipData.active = false;
                break;
            case "TalentData":
                this.PilotData.active = false;
                this.ShipData.active = false;
                break;
            case "SupportData":
                this.PilotData.active = false;
                this.ShipData.active = false;
                break;
            case "PilotStat":
                this.PilotData.active = true;
                this.ShipData.active = false;
                break;
            case "SpaceShipStat":
                this.PilotData.active = false;
                this.ShipData.active = true;
                break;
            case "PlayerData":
                this.PilotData.active = false;
                this.ShipData.active = false;
                break;
            default:
                this.PilotData.active = false;
                this.ShipData.active = false;
                break;
        }
    }

    public OnClickConfirm()
    {
        if(this.text == "PilotStat")
        {
            let pilot = BaseDataManager.internalGetUserData("PilotStat");
            for(let i = 0; i < this.PilotData.childrenCount; i++)
            {
                let changeltVal = this.PilotData.children[i].getComponent(cc.EditBox).string;
                switch(i)
                {
                    case 0:
                        if(changeltVal != "")
                        {
                            pilot.HP_Gennerate = changeltVal;
                        }
                        break;
                    case 1:
                        if(changeltVal != "")
                        {
                            pilot.HealMultiplier = changeltVal;
                        }
                        break;
                    case 2:
                        if(changeltVal != "")
                        {
                            pilot.Luck = changeltVal;
                        }
                        break;
                    case 3:
                        if(changeltVal != "")
                        {
                            pilot.BaseCritRate = changeltVal;
                        }
                        break;
                    case 4:
                        if(changeltVal != "")
                        {
                            pilot.BaseCritDmg = changeltVal;
                        }
                        break;
                }
                this.PilotData.children[i].getComponent(cc.EditBox).string = "";
            }
            BaseDataManager.internalSaveUserData("PilotStat", pilot);
        }
        if(this.text == "SpaceShipStat")
        {
            let ship = BaseDataManager.internalGetUserData("SpaceShipStat");
            for(let i = 0; i < this.ShipData.childrenCount; i++)
            {
                let changeltVal = this.ShipData.children[i].getComponent(cc.EditBox).string;
                switch(i)
                {
                    case 0:
                        if(changeltVal != "")
                        {
                            ship.ID = changeltVal;
                        }
                        break;
                    case 1:
                        if(changeltVal != "")
                        {
                            ship.MaxHP = changeltVal;
                        }
                        break;
                    case 2:
                        if(changeltVal != "")
                        {
                            ship.AtkSpeed = changeltVal;
                        }
                        break;
                    case 3:
                        if(changeltVal != "")
                        {
                            ship.DmgMultiplier = changeltVal;
                        }
                        break;
                    case 4:
                        if(changeltVal != "")
                        {
                            ship.ArmorPen = changeltVal;
                        }
                        break;
                    case 5:
                        if(changeltVal != "")
                        {
                            ship.Def = changeltVal;
                        }
                        break;
                }
                this.ShipData.children[i].getComponent(cc.EditBox).string = "";
            }
            BaseDataManager.internalSaveUserData("SpaceShipStat", ship);
        }
        this.CreateInstanceClass(this.text);
    }

    update (dt) 
    {
        if(this.text != this.DopdownBox.getComponent(DropDownBox).SelectLabel.string)
        {
            this.text = this.DopdownBox.getComponent(DropDownBox).SelectLabel.string;
            this.CreateInstanceClass(this.text);
        }
    }
}
