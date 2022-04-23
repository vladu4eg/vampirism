require('libraries/notifications')

function SendErrorMessage( pID, string )
    Notifications:ClearBottom(pID)
    Notifications:Bottom(pID, {text=string, style={color='#E62020'}, duration=2})
    EmitSoundOnEntityForPlayer("General.Cancel", PlayerResource:GetPlayer(pID), pID)
end