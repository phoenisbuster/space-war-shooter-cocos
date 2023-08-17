const {ccclass, property} = cc._decorator;

export class SettingData 
{
    ToggleMusic: boolean = true;
    VolumeMusic: number = 1;
    VolumeSound: number = 1;
}

@ccclass
export class ItemData 
{
    CoreID: number = 0;
    WeaponID: number = 0;
    AmmoID: number = 0;
    EngineID: number = 0;
}

@ccclass
export class TalentData 
{
    LevelUpgrade: number = 0;
}

@ccclass
export class SupportData 
{
    SupID: number = 0;
    SupLv: number = 1;
    SupType: string = "Common"      //Common, Rare, Superior, Epic, Legendary
}

@ccclass
export class PilotStat 
{
    HP_Gennerate: number = 0.01;    //per sec, x10 one tick at new wave/round, stack additively
    HealMultiplier: number = 0;     //percent unit, stack additively
    Luck: number = 100;             //Luck over 1000 => Gacha or Increase Overall Crit Rate, stack additively
    BaseCritRate: number = 5;       //percent unit, stack additively
    BaseCritDmg: number = 120;      //percent unit, stack additively
}

@ccclass
export class SpaceShipStat 
{
    ID: number = 3;
    MaxHP: number = 20;
    AtkSpeed: number = 2.5;         //Number of shot per second => equal to 1/fire_rate
    DmgMultiplier: number = 1;      //percent unit, stack additively
    ArmorPen: number = 0;           //percent unit, stack multiplicative
    Def: number = 10;    
}

@ccclass
export class PlayerData 
{
    Name: string = "Player Name";
    EXP: number  = 0;
    Gold: number = 0;           //In-game
    SkillPoint: number  = 0;    //Skill tree point
    Scraps: number = 0;         //Reforge items materials
    Money: number = 0;          //Micro-transaction

    DailyCheckIn: number = 0;
    PlayedTimeCheckIn: number = 0;
    UnlockedMissionID: number[] = [];
    CompletedMissionID: number[] = [];
    UnlockedAchivementID: number[] = [];
}
