require('top')

Clanwars = Clanwars or {}
local dedicatedServerKey = GetDedicatedServerKeyV2("1")
local checkResult = {}

function Clanwars.SubmitMatchData(winner,callback)
	if GameRules.startTime == nil then
		GameRules.startTime = 1
	end
	if not GameRules.isTesting  then
		if GameRules:IsCheatMode() then 
			GameRules:SetGameWinner(winner)
			SetResourceValues()
			return 
		end
	end
	local data = {}
	local debuffPoint = 0
	local sign = 1 
	for pID=0,DOTA_MAX_TEAM_PLAYERS do
		if PlayerResource:IsValidPlayerID(pID) and PlayerResource:GetTeam(pID) ~= 5 then
			if GameRules.scores[pID] == nil then
				GameRules.scores[pID] = {elf = 0, troll = 0}
				GameRules.scores[pID].elf = 0
				GameRules.scores[pID].troll = 0
			end
			DebugPrint("pID " .. pID )
			if GameRules.Bonus[pID] == nil then
				GameRules.Bonus[pID] = 0
			end
			if checkResult[pID] == nil then
				checkResult[pID] = 1
			else
				goto continue
			end
			local koeff = 1
			if PlayerResource:GetTeam(pID) ~= winner then
				koeff = -1 
			end

			if GameRules:GetGameTime() - GameRules.startTime < 900 then -- 15 min
				GameRules.Bonus[pID] = GameRules.Bonus[pID] + (10 * koeff)
			elseif GameRules:GetGameTime() - GameRules.startTime >= 900 and GameRules:GetGameTime() - GameRules.startTime <  1500 then -- 15-25 min
				GameRules.Bonus[pID] = GameRules.Bonus[pID] + (7 * koeff)
			elseif GameRules:GetGameTime() - GameRules.startTime >= 1500 and GameRules:GetGameTime() - GameRules.startTime < 2100 then -- 25-35 min 
				GameRules.Bonus[pID] = GameRules.Bonus[pID] + (5 * koeff)
			elseif GameRules:GetGameTime() - GameRules.startTime >= 2100 then
				GameRules.Bonus[pID] = GameRules.Bonus[pID] + (3 * koeff)
			end

			if PlayerResource:GetDeaths(pID) >= 1 then 
				GameRules.Bonus[pID] = GameRules.Bonus[pID] - 5
			end
			 
		end
	end

	if GameRules.PlayersCount >= MIN_RATING_PLAYER_CW then
		for pID=0,DOTA_MAX_TEAM_PLAYERS do
			if PlayerResource:IsValidPlayerID(pID) and PlayerResource:GetTeam(pID) ~= 5 then
				data.MatchID = tostring(GameRules:Script_GetMatchID() or 0)
				data.Gem = 10
				data.Team = tostring(PlayerResource:GetTeam(pID))
				--data.duration = GameRules:GetGameTime() - GameRules.startTime
				data.Map = GetMapName()
				local hero = PlayerResource:GetSelectedHeroEntity(pID)
				data.SteamID = tostring(PlayerResource:GetSteamID(pID) or 0)
				data.Time = tostring(tonumber(GameRules:GetGameTime() - GameRules.startTime)/60 or 0)
				data.GoldGained = tostring(PlayerResource:GetGoldGained(pID)/1000 or 0)
				data.GoldGiven = tostring(PlayerResource:GetGoldGiven(pID)/1000 or 0)
				data.LumberGained = tostring(PlayerResource:GetLumberGained(pID)/1000 or 0)
				data.LumberGiven = tostring(PlayerResource:GetLumberGiven(pID)/1000 or 0)
				data.Kill = tostring(PlayerResource:GetKills(pID) or 0)
				data.Death = tostring(PlayerResource:GetDeaths(pID) or 0)
				
				data.Nick = tostring(PlayerResource:GetPlayerName(pID))
				data.GPS = tostring(tonumber(data.GoldGained)/tonumber(GameRules:GetGameTime() - GameRules.startTime))
				data.LPS = tostring(tonumber(data.LumberGained)/tonumber(GameRules:GetGameTime() - GameRules.startTime))
				
				data.GetScoreBonus = tostring(PlayerResource:GetScoreBonus(pID))
				if tonumber(data.GetScoreBonus) > 0 then
					data.GetScoreBonus = tostring(math.floor(tonumber(data.GetScoreBonus) * sign))
				end
				data.GetScoreBonusRank = tostring(PlayerResource:GetScoreBonusRank(pID))
				data.GetScoreBonusGoldGained = tostring(PlayerResource:GetScoreBonusGoldGained(pID))
				data.GetScoreBonusGoldGiven = tostring(PlayerResource:GetScoreBonusGoldGiven(pID))
				data.GetScoreBonusLumberGained = tostring(PlayerResource:GetScoreBonusLumberGained(pID))
				data.GetScoreBonusLumberGiven = tostring(PlayerResource:GetScoreBonusLumberGiven(pID))		
				data.Score = 0
				if hero then
					data.Type = tostring(PlayerResource:GetType(pID) or "null")
					data.Score = tostring(math.floor(GameRules.Bonus[pID] + tonumber(data.GetScoreBonus)))
				else
					data.Type = "ELF DEATH"
					data.Score = tostring(math.floor(GameRules.Bonus[pID] + tonumber(data.GetScoreBonus)))
					data.Team = tostring(2)
				end
				data.Key = dedicatedServerKey
				data.BonusPercent = "0"
				local text = tostring(PlayerResource:GetPlayerName(pID)) .. " got " .. data.Score
				GameRules.Score[pID] = data.Score
				GameRules:SendCustomMessage(text, 1, 1)
				Clanwars.SendData(data,callback)
				if data.Gem > 0 then
					data.EndGame = 1
					Shop.GetGem(data)
				end
			end 
		end
	end
	::continue::
	Timers:CreateTimer(5, function() 
		GameRules:SetGameWinner(winner)
		SetResourceValues()
	end)
end

function Clanwars.SendData(data,callback)
	local req = CreateHTTPRequestScriptVM("POST",GameRules.server)
	local encData = json.encode(data)
	DebugPrint("***********************************************")
	DebugPrint(GameRules.server)
	DebugPrint(encData)
	DebugPrint("***********************************************")
	req:SetHTTPRequestHeaderValue("Dedicated-Server-Key", dedicatedServerKey)
	req:SetHTTPRequestRawPostBody("application/json", encData)
	req:Send(function(res)
		DebugPrint("***********************************************")
		DebugPrint(res.Body)
		DebugPrint("Response code: " .. res.StatusCode)
		DebugPrint("***********************************************")
		if res.StatusCode ~= 200 then
			GameRules:SendCustomMessage("Error connecting", 1, 1)
			DebugPrint("Error connecting")
		end
		
		if callback then
			local obj,pos,err = json.decode(res.Body)
			callback(obj)
		end
		
	end)
end
