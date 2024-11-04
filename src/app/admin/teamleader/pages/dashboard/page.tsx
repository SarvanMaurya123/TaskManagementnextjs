'use client'
import TeamLeaderAdminMainLayout from "@/app/components/teamleader/TeamLreaderadminLayout"
import GetTeams from "../component/GetTeam"

export default async function () {
    return (<>
        <TeamLeaderAdminMainLayout>
            <div>
                <GetTeams />
            </div>
        </TeamLeaderAdminMainLayout>
    </>)
}