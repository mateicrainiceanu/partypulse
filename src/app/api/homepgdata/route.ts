import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import Events from "../_lib/models/event";
import Relationship from "../_lib/models/relationship";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            let [friends] = await User.getFriends(user.id) as any

            //EVENTS THAT FRIENDS LIKE, ATTEND, DJ, ORGANISE

            const data = friends.map(async (friend: { secUserId: number }) => {
                const friendsData = (await User.findById(friend.secUserId) as any)[0]                
                if (friendsData.length > 0) {
                    let [friendData] = friendsData;
                    const eventMatches = (await Events.getEventsForRelsUserId(friend.secUserId, user.id as number) as any)
                    const obj = { uname: (friendData.uname), role: friendData.role, eventMatches }
                    return obj;
                } else return {uname: ""}
            })            

            const eventsFromOtherUsers = ((await Promise.all(data)).filter(o => (o.eventMatches != null && o.uname != "")));

            // EVENTS FORM LIKED LOCATIONS

            const [locationrels] = await Relationship.getLocForUser(user.id, 0) as any

            const results = locationrels.map(async (rel: { locationId: number }) => {
                return await Events.getFullForLocation(rel.locationId, user.id!)
            })

            const eventsFromLikedLocations = (await Promise.all(results)).filter((o: { events: Array<Events> }) => o.events.length > 0)
            //console.log(eventsFromLikedLocations);

            return NextResponse.json({ eventsFromOtherUsers, eventsFromLikedLocations })

        } else {
            return new NextResponse("Failed To authenticate user", { status: 403 })
        }
    } else {
        return new NextResponse("Failed To authenticate user", { status: 403 })
    }
    return new NextResponse("Not returning anything yet", { status: 500 })
}

