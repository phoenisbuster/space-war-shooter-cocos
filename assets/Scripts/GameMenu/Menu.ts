import { DropDownBox } from "../Learning/DropDown/DropDownBox";
import GlobalTime from "../OtherScript/GlobalDTime";
import BaseDataManager from "../UserData/DataManager";
import { ItemData, PilotStat, PlayerData, SettingData, SpaceShipStat, SupportData, TalentData } from "../UserData/UserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component 
{

    @property(cc.Node)
    LoadingScreen: cc.Node = null;

    @property(cc.Node)
    SettingScreen: cc.Node = null;

    @property(cc.Node)
    FPSDisplay: cc.Node = null;

    @property(cc.Node)
    GameAudio: cc.Node = null;

    @property(cc.Node)
    LevelSlider: cc.Node = null;

    @property(cc.Node)
    SurvivalBtn: cc.Node = null;

    SceneName: string = "";

    @property(cc.Node)
    FetchingDataNode: cc.Node = null;

    @property(cc.Node)
    UpdateLayout: cc.Node = null;

    static UserData = ["SettingData", "ItemData", "TalentData", 
    "SupportData", "PilotStat", "SpaceShipStat", "PlayerData"];

    // LIFE-CYCLE CALLBACKS:

    onLoad()
    {
        this.UpdateLayout.children[2].getComponent(DropDownBox).itemContent = Menu.UserData;
        let loadData = ()=> 
        {
            let test = this.LoadInitUserData(Menu.UserData);
            this.scheduleOnce(() => 
            {    
                this.FetchingDataNode.active = false;
            }, 1);    
        }  
        loadData();
    }

    start() 
    {
              
    }

    LoadInitUserData(_userDataList: string[] = []): boolean
    {
        try
        {    
            _userDataList.forEach(class_name=>
            {
                if(!BaseDataManager.internalGetUserData(class_name))
                {
                    BaseDataManager.internalSaveUserData(class_name, this.CreateInstanceClass(class_name));
                    if(!BaseDataManager.internalGetUserData(class_name))
                    {
                        throw new Error("THE value of User Data is NULL " + class_name);    
                    }  
                }
                else
                {
                    //cc.warn("Already has " + class_name);
                }
            });
            return true;
        }
        catch(e)
        {
            cc.error("ERROR at load data: " + e);
            return false;
        }
    }

    CreateInstanceClass(_class_name: string)
    {
        let returnValue = null;
        switch(_class_name)
        {
            case "SettingData":
                returnValue = new SettingData();
                break;
            case "ItemData":
                returnValue = new ItemData();
                break;
            case "TalentData":
                returnValue = new TalentData();
                break;
            case "SupportData":
                returnValue = new SupportData();
                break;
            case "PilotStat":
                returnValue = new PilotStat();
                break;
            case "SpaceShipStat":
                returnValue = new SpaceShipStat();
                break;
            case "PlayerData":
                returnValue = new PlayerData();
                break;
            default:
                returnValue = null;
                break;
        }
        return returnValue;
    }

    public LoadScene(event, customEventData)
    {
        this.LoadingScreen.active = true;
        console.log(customEventData);
        cc.log(customEventData);
        cc.director.preloadScene(customEventData, (progress: number, total: number, item) =>
        {
            this.LoadingScreen.children[1].getComponent(cc.ProgressBar).progress = progress;
            if(progress === total)
            {
                this.LoadingScreen.children[0].active = true;
                this.LoadingScreen.getComponent(cc.Button).interactable = true;
                this.SceneName = customEventData;
            }
        })
    }

    public OnTapScreen()
    {
        try
        {
            cc.director.loadScene(this.SceneName);
        }
        catch(e)
        {
            console.log(e);
        }
        
    }

    public OnClickSetting()
    {
        this.SettingScreen.active = !this.SettingScreen.activeInHierarchy;
        let settingData = BaseDataManager.internalGetUserData("SettingData");
        if(settingData != null)
        {
            settingData.ToggleMusic = !settingData.ToggleMusic;
            BaseDataManager.internalSaveUserData("SettingData", settingData);
        }
        
    }

    public OnClickUpdateData()
    {
        this.UpdateLayout.active = !this.UpdateLayout.activeInHierarchy;
    }

    public OnClickClearData()
    {
        cc.sys.localStorage.clear();
        Menu.UserData.forEach(ele => 
        {
            BaseDataManager.internalSaveUserData(ele, this.CreateInstanceClass(ele));
        });
    }

    public OnClickQuit()
    {
        cc.game.end();
    }

    update(dt: number) 
    {
        let fps = (1/dt>57 && 1/dt<63)? 60 : 1/dt;

        this.FPSDisplay.getComponent(cc.RichText).string = "<color=#00ff00>FPS: </c><color=#0fffff>" 
                                                            + fps + "</color>";
    }
}
