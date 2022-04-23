if chatcommand == nil then
	DebugPrint( 'chatcommand' )
	_G.chatcommand = class({})
end
local lastCommandChat = {}

function chatcommand:OnPlayerChat(event)
	local hero = PlayerResource:GetSelectedHeroEntity(event.playerid)
	if event.text == "!rank" and GameRules:GetGameTime() - GameRules.startTime > 60 and 
		(lastCommandChat[event.playerid] == nil or lastCommandChat[event.playerid] + 120 < GameRules:GetGameTime() - GameRules.startTime) then
		local message =  PlayerResource:GetPlayerName(event.playerid) .. " has a Elf score: " .. GameRules.scores[event.playerid].elf .. "; Troll score: " .. GameRules.scores[event.playerid].troll
		GameRules:SendCustomMessage("<font color='#00FF80'>" ..  message ..  "</font>", event.playerid, 0)		
		lastCommandChat[event.playerid] = GameRules:GetGameTime() 
		elseif event.text == "!bonus" and GameRules:GetGameTime() - GameRules.startTime > 60 and 
		(lastCommandChat[event.playerid] == nil or lastCommandChat[event.playerid] + 120 < GameRules:GetGameTime() - GameRules.startTime) then
		if GameRules.BonusPercent  > 0.77 then
			GameRules.BonusPercent = 0.77
		end
		local text = "Total rating bonus for this match " .. (GameRules.BonusPercent * 100) .. "%!"
		GameRules:SendCustomMessage("<font color='#00FF80'>" .. text ..  "</font>" , 1, 1)
		lastCommandChat[event.playerid] = GameRules:GetGameTime() 
		elseif event.text == "!list" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382) then
		for pID = 0,DOTA_MAX_TEAM_PLAYERS do
			if PlayerResource:IsValidPlayerID(pID) then
				local text = "Nick: " .. PlayerResource:GetPlayerName(pID) .. " pID: " .. pID
				GameRules:SendCustomMessage(text, 1, 1)
			end
		end
		elseif string.match(event.text,"%D+") == "!kick" and PlayerResource:GetSteamAccountID(event.playerid) == 201083179 then
		local id_kick = tonumber(string.match(event.text,"%d+"))
		local hero_kick = PlayerResource:GetSelectedHeroEntity(id_kick)
		--if hero:GetTeamNumber() == hero_kick:GetTeamNumber() then
			hero_kick:ForceKill(true)
			if hero_kick.units ~= nil then
				for i=1,#hero_kick.units do
					if hero_kick.units[i] and not hero_kick.units[i]:IsNull() then
						local unit = hero_kick.units[i]
						unit:ForceKill(false)
					end
				end
			end
			UTIL_Remove(hero_kick)
			SendToServerConsole("kick " .. PlayerResource:GetPlayerName(id_kick))
		--end
		elseif string.match(event.text,"%D+") == "!kill" and PlayerResource:GetSteamAccountID(event.playerid) == 201083179 then
		local id_kick = tonumber(string.match(event.text,"%d+"))
		local hero_kick = PlayerResource:GetSelectedHeroEntity(id_kick)
		hero_kick:ForceKill(true)
		elseif event.text == "!drop" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)  then
		local spawnPoint = hero:GetAbsOrigin()	
		local newItem = CreateItem("item_vip", nil, nil )
		local drop = CreateItemOnPositionForLaunch( spawnPoint, newItem )
		local dropRadius = RandomFloat( 50, 100 )
		newItem:LaunchLootInitialHeight( false, 0, 150, 0.5, spawnPoint + RandomVector( dropRadius ) )
		elseif event.text == "!gem" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)  then
		local spawnPoint = hero:GetAbsOrigin()	
		local newItem = CreateItem("item_get_gem", nil, nil )
		local drop = CreateItemOnPositionForLaunch( spawnPoint, newItem )
		local dropRadius = RandomFloat( 50, 100 )
		newItem:LaunchLootInitialHeight( false, 0, 150, 0.5, spawnPoint + RandomVector( dropRadius ) )

		elseif event.text == "!gold" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)  then
		local spawnPoint = hero:GetAbsOrigin()	
		local newItem = CreateItem("item_get_gold", nil, nil )
		local drop = CreateItemOnPositionForLaunch( spawnPoint, newItem )
		local dropRadius = RandomFloat( 50, 100 )
		newItem:LaunchLootInitialHeight( false, 0, 150, 0.5, spawnPoint + RandomVector( dropRadius ) )

		elseif string.match(event.text,"%D+") == "!delete" and PlayerResource:GetSteamAccountID(event.playerid) == 201083179 then
		local id_kick = tonumber(string.match(event.text,"%d+"))
		local hero_kick = PlayerResource:GetSelectedHeroEntity(id_kick)
		if hero:GetTeamNumber() == hero_kick:GetTeamNumber() then
			if hero_kick.units ~= nil then
				for i=1,#hero_kick.units do
					if hero_kick.units[i] and not hero_kick.units[i]:IsNull() then
						local unit = hero_kick.units[i]
						unit:ForceKill(false)
					end
				end
			end
		end
		
		elseif event.text == "!event" and GameRules:GetGameTime() - GameRules.startTime > 60 and 
		(lastCommandChat[event.playerid] == nil or lastCommandChat[event.playerid] + 120 < GameRules:GetGameTime() - GameRules.startTime) then
		local steamID = tostring(PlayerResource:GetSteamID(event.playerid))
		local pID = tonumber(event.playerid)
		DebugPrint(pID)
		Shop.RequestEvent(pID, steamID, callback)
		lastCommandChat[event.playerid] = GameRules:GetGameTime() 
		elseif event.text == "!test" then
		if GameRules:IsCheatMode() then 
			GameRules.test = true
			TROLL_SPAWN_TIME = 5
			PRE_GAME_TIME = 10
		end
		elseif event.text == "!test2" then
		if GameRules:IsCheatMode() then 
			GameRules.test = true
			GameRules.test2 = true
			TROLL_SPAWN_TIME = 5
			PRE_GAME_TIME = 10
		end

	elseif event.text == "!troll" then
		if GameRules:IsCheatMode() then 
			GameRules.test = true
			GameRules.test2 = true
			GameRules.trollHero =  hero
        	GameRules.trollID = event.playerid
			TROLL_SPAWN_TIME = 5
			PRE_GAME_TIME = 10
			local units = Entities:FindAllByClassname("npc_dota_creature")
			for _, unit in pairs(units) do
				local unit_name = unit:GetUnitName();
				if string.match(unit_name, "shop") or
					string.match(unit_name, "troll_hut") then
					unit:SetOwner(hero)
					unit:SetControllableByPlayer(event.playerid, true)
					unit:AddNewModifier(unit, nil, "modifier_invulnerable", {})
					unit:AddNewModifier(unit, nil, "modifier_phased", {})
					if string.match(unit_name, "troll_hut") then
						unit.ancestors = {}
						ModifyStartedConstructionBuildingCount(hero, unit_name, 1)
						ModifyCompletedConstructionBuildingCount(hero, unit_name, 1)
						BuildingHelper:AddModifierBuilding(unit)
						BuildingHelper:BlockGridSquares(GetUnitKV(unit_name, "ConstructionSize"), 0, unit:GetAbsOrigin())
					end
					elseif string.match(unit_name, "npc_dota_units_base2") then
					unit:AddNewModifier(unit, nil, "modifier_invulnerable", {})
					unit:AddNewModifier(unit, nil, "modifier_phased", {})
				end
			end
		end

		elseif event.text == "!notest" then
		if GameRules:IsCheatMode() then 
			GameRules.test = false
			GameRules.test2 = false
		end
		elseif event.text == "!mute" then
			if GameRules.Mute[event.playerid] == nil then
				GameRules.Mute[event.playerid] = true
			else
				GameRules.Mute[event.playerid] = nil
			end		 
		elseif event.text == "!fps" then
			GameRules.PlayersFPS[event.playerid] = true
		elseif event.text == "!unfps" then
			GameRules.PlayersFPS[event.playerid] = false
		elseif event.text == "!birthday" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382) then
		local spawnPoint = hero:GetAbsOrigin()	
		local newItem = CreateItem("item_event_birthday", nil, nil )
		local drop = CreateItemOnPositionForLaunch( spawnPoint, newItem )
		local dropRadius = RandomFloat( 50, 100 )
		newItem:LaunchLootInitialHeight( false, 0, 150, 0.5, spawnPoint + RandomVector( dropRadius ) )

		elseif string.match(event.text,"%D+") == "!doom" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)
		then
        local info = {}
    	info.PlayerID = event.playerid
		local id_kick = tonumber(string.match(event.text,"%d+"))
   		info.hero = PlayerResource:GetSelectedHeroEntity(id_kick)
		Pets.DeletePet(info)
		UTIL_Remove(hero)
		PlayerResource:ReplaceHeroWith(id_kick, "npc_dota_hero_doom_bringer", 0, 0)
        hero = PlayerResource:GetSelectedHeroEntity(id_kick)
        PlayerResource:SetCustomTeamAssignment(id_kick, DOTA_TEAM_CUSTOM_1) -- A workaround for wolves sometimes getting stuck on elves team, I don't know why or how it happens.
        local pos = Vector(0, -640, 256)
		FindClearSpaceForUnit(hero, pos, true)
		hero:AddItemByName("item_dmg_14")
        hero:AddItemByName("item_armor_13")
        hero:AddItemByName("item_hp_12")
        hero:AddItemByName("item_hp_reg_12")
		hero:AddItemByName("item_dmg_14")
		hero:CalculateStatBonus(true)

	elseif string.match(event.text,"%D+") == "!lina" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
	or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
	or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
	or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)
	then
	local info = {}
	info.PlayerID = event.playerid
	local id_kick = tonumber(string.match(event.text,"%d+"))
   	info.hero = PlayerResource:GetSelectedHeroEntity(id_kick)
	Pets.DeletePet(info)
	UTIL_Remove(hero)
	PlayerResource:ReplaceHeroWith(id_kick, "npc_dota_hero_lina", 0, 0)
	hero = PlayerResource:GetSelectedHeroEntity(id_kick)
	PlayerResource:SetCustomTeamAssignment(id_kick, DOTA_TEAM_CUSTOM_1) -- A workaround for wolves sometimes getting stuck on elves team, I don't know why or how it happens.
	local pos = Vector(0, -640, 256)
	FindClearSpaceForUnit(hero, pos, true)
	hero:AddItemByName("item_aghanims_shard")
	hero:CalculateStatBonus(true)

		elseif string.match(event.text,"%D+") == "!phantom" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)
		then
        local info = {}
    	info.PlayerID = event.playerid
		local id_kick = tonumber(string.match(event.text,"%d+"))
		info.hero = PlayerResource:GetSelectedHeroEntity(id_kick)
		Pets.DeletePet(info)
		UTIL_Remove(hero)
		PlayerResource:ReplaceHeroWith(id_kick, "npc_dota_hero_phantom_assassin", 0, 0)
        hero = PlayerResource:GetSelectedHeroEntity(id_kick)
        PlayerResource:SetCustomTeamAssignment(id_kick, DOTA_TEAM_CUSTOM_2) -- A workaround for wolves sometimes getting stuck on elves team, I don't know why or how it happens.
        local pos = Vector(0, -640, 256)
		FindClearSpaceForUnit(hero, pos, true)
		hero:AddItemByName("item_flicker")
		hero:CalculateStatBonus(true)

		elseif string.match(event.text,"%D+") == "!tide" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)
		then
        local info = {}
    	info.PlayerID = event.playerid
		local id_kick = tonumber(string.match(event.text,"%d+"))
		info.hero = PlayerResource:GetSelectedHeroEntity(id_kick)
		Pets.DeletePet(info)
		UTIL_Remove(hero)
		PlayerResource:ReplaceHeroWith(id_kick, "npc_dota_hero_tidehunter", 0, 0)
        hero = PlayerResource:GetSelectedHeroEntity(id_kick)
        PlayerResource:SetCustomTeamAssignment(id_kick, DOTA_TEAM_CUSTOM_3) -- A workaround for wolves sometimes getting stuck on elves team, I don't know why or how it happens.
        local pos = Vector(0, -640, 256)
		FindClearSpaceForUnit(hero, pos, true)
		hero:CalculateStatBonus(true)

		elseif string.match(event.text,"%D+") == "!noboss" and (PlayerResource:GetSteamAccountID(event.playerid) == 201083179 
		or PlayerResource:GetSteamAccountID(event.playerid) == 337000240 
		or PlayerResource:GetSteamAccountID(event.playerid) == 183899786 
		or PlayerResource:GetSteamAccountID(event.playerid) == 155143382)
		then
        local info = {}
    	info.PlayerID = event.playerid
		local id_kick = tonumber(string.match(event.text,"%d+"))
		info.hero = PlayerResource:GetSelectedHeroEntity(id_kick)
		Pets.DeletePet(info)
		UTIL_Remove(hero)
		PlayerResource:ReplaceHeroWith(id_kick, "npc_dota_hero_dark_willow", 0, 0)
        hero = PlayerResource:GetSelectedHeroEntity(id_kick)
        PlayerResource:SetCustomTeamAssignment(id_kick, DOTA_TEAM_GOODGUYS) -- A workaround for wolves sometimes getting stuck on elves team, I don't know why or how it happens.
        local pos = Vector(0, -640, 256)
		FindClearSpaceForUnit(hero, pos, true)
		hero:CalculateStatBonus(true)

	--elseif event.text == "!skin" then
	--	wearables:RemoveWearables(hero)
	--	SetModelVip(hero, "633")
		--elseif event.text == "!xp" then
		--	GameRules:SendCustomMessage("<font color='#00FF80'>" .. hero:GetCurrentXP() ..  "</font>" , 1, 1)
		--elseif event.text == "!xpup" then
		--	hero:AddExperience(50,DOTA_ModifyXP_Unspecified,false,false)
		--elseif event.text == "!map" then
				-- Must set the map name prior to getting the neighboring room height difference
				--local mapList = EncounterData.szMapNames
				--if GameRules.Aghanim:IsMapFlipped() and EncounterData.szFlippedMapNames ~= nil then
				--	mapList = EncounterData.szFlippedMapNames
				--end					
				--local szMapName = mapList[ self:RoomRandomInt( 1, #mapList ) ]
				--local ExitRoom.szMapName = szMapName
		--DOTA_SpawnMapAtPosition( "winter", Vector(0,0,100), false, nil, nil, nil )
	
	
	
	--elseif event.text == "!fps" then
	--	GameRules.PlayersFPS[event.playerid] = true
	--	if hero.units ~= nil then
	--		for i=1,#hero.units do
	--			if hero.units[i] and not hero.units[i]:IsNull() then
	--				local unit = hero.units[i]
	--				DebugPrint(unit:GetUnitName())
	--				local dataTable = { entityIndex = unit:GetEntityIndex() }
	--				local player = hero:GetPlayerOwner()
	--				if player then
	--					if string.match(hero.units[i]:GetUnitName(),"mine") then
	--						CustomGameEventManager:Send_ServerToPlayer(player, "gold_gain_stop", dataTable)
	--					elseif string.match(hero.units[i]:GetUnitName(),"wisp") then 
	--						CustomGameEventManager:Send_ServerToPlayer(player, "tree_wisp_harvest_stop", dataTable)
	--					end
	--				end
	--			end
	--		end
	--	end
	--elseif event.text == "!unfps" then
	--	GameRules.PlayersFPS[event.playerid] = false
	--	if hero.units ~= nil then
	--		for i=1,#hero.units do
	--			if hero.units[i] and not hero.units[i]:IsNull() then
	--				local unit = hero.units[i]
	--				DebugPrint(unit:GetUnitName())
	--				local dataTable = { entityIndex = unit:GetEntityIndex() }
	--				local player = hero:GetPlayerOwner()
	--				if player then
	--					if string.match(hero.units[i]:GetUnitName(),"mine") then
	--						CustomGameEventManager:Send_ServerToPlayer(player, "gold_gain_start", dataTable)
	--					elseif string.match(hero.units[i]:GetUnitName(),"wisp") then
	--						CustomGameEventManager:Send_ServerToPlayer(player, "tree_wisp_harvest_start", dataTable)
	--					end
	--				end
	--			end
	--		end
	--	end
	--elseif event.text  ==  "stats"  then
	--local playerStatsScore = CustomNetTables:GetTableValue("scorestats",tostring(event.playerid)); 
	--CustomNetTables:SetTableValue("scorestats", tostring(event.playerid), { playerScoreElf = tostring(GameRules.scores[event.playerid].elf), playerScoreTroll = tostring(GameRules.scores[event.playerid].troll) })
	--DebugPrint(GameRules.scores[event.playerid].elf)
	--DebugPrint(GameRules.scores[event.playerid].troll)
	--DebugPrintTable("playerStatsScore   "  ..  playerStatsScore)
	--elseif event.text == "blink" then 
	--	hero:ClearInventoryCM()
	--elseif event.text == "test" then
	--local data = {}
	--data.SteamID = tostring(PlayerResource:GetSteamID(event.playerid))
	--data.Num = "2"
	--data.Srok = "01/09/2020"
	--Shop.GetVip(data, callback)
	--http.SendRequest("post", "/test", "228")
	
	--elseif event.text == "get" then
	--Stats.RequestDataTop10(callback)
	--local stats = CustomNetTables:GetTableValue( "top10", "test" )
	--DebugPrint(stats)
	--DebugPrintTable(stats)
	--trollnelves2:OnLoadTop(stats.steamID, 1)
	--elseif event.text == "test_r" then
	--GameRules:SendCustomMessage("Please do not leave the game.", 1, 1)
	--Stats.SubmitMatchData(DOTA_TEAM_BADGUYS, callback)
	--GameRules:SendCustomMessage("The game can be left, thanks!", 1, 1)
	--elseif event.text == "test" then
	--local hero = PlayerResource:GetSelectedHeroEntity(event.playerid)
	--hero:RemoveDesol2()
end

end