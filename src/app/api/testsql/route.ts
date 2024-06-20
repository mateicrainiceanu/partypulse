import { NextResponse } from "next/server";
import { db } from "../_lib/config/db";
import Location from "../_lib/models/location";
export async function GET() {

    let uid = 30;
    let id = 15;

    const [res] = await db.safeexe(`
        SELECT 
            events.*, 
            locations.name AS location, 
            JSON_OBJECT(
                'id', locations.id,
                'name', locations.name,
                'adress', locations.adress,
                'useForAdress', locations.useForAdress,
                'lat', locations.lat,
                'lon', locations.lon,
                'city', locations.city,
                'userInteractions', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'userId', users_locations.userId,
                    'reltype', users_locations.reltype
                ))
            ) AS locationData, 
            JSON_ARRAYAGG(
               JSON_OBJECT(
                    'userId', users_events.userId,
                    'reltype', users_events.reltype,
                    'uname', users.uname
                )
            ) AS userRelations
        FROM events
        JOIN locations ON locations.id = events.locationId
        JOIN users_events ON users_events.eventId = events.id
        JOIN users ON users.id = users_events.userId
        JOIN users_locations ON users_locations.locationId = locations.id
        WHERE eventId = ?
        GROUP BY events.id, locations.id;
        ;`, [20])

    const [event] = res

    let djs: string[] = []
    let userHasRightToManage = false
    let userIsDJ = false
    let there = false
    let coming = false
    let liked = false

    event.userRelations.map((rel: { uname: string, reltype: number, userId: number }) => {
        if (rel.userId === uid) {
            switch (rel.reltype) {
                case 1:
                    userHasRightToManage = true
                    break;
                case 2:
                    userIsDJ = true
                    break;
                case 3:
                    there = true
                    break;
                case 4:
                    coming = true
                    break;
                case 5:
                    liked = true
                    break;
                default:
                    break;
            }
        }

        if (rel.reltype === 2 && djs.indexOf(rel.uname) == -1)
           djs.push(rel.uname)

    })

    const fullEvent = { ...event, djs, userHasRightToManage, userIsDJ, there, liked, coming }




    return NextResponse.json(fullEvent);
}