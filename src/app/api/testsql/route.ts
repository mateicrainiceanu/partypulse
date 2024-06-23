import { NextResponse } from "next/server";
import { db } from "../_lib/config/db";
import Events from "../_lib/models/event";
import Location from "../_lib/models/location";

export async function GET() {

    let uid = 30

    let sql = `
SELECT
    users_notifications.*,
    JSON_OBJECT(
        'uname', users.uname,
        'role', users.role
    ) AS fromUser,
    JSON_OBJECT(
        'name', COALESCE(events.name, ''),
        'privateev', COALESCE(events.privateev, ''),
        'dateStart', COALESCE(events.dateStart, ''),
        'status', COALESCE(events.status, ''),
        'duration', COALESCE(events.duration, ''),
        'locationId', COALESCE(events.locationId, ''),
        'msuggestions', COALESCE(events.msuggestions, ''),
        'genreVote', COALESCE(events.genreVote, ''),
        'locationData', JSON_OBJECT(
            'name', COALESCE(locations.name, '')
        ),
        'usersRelations', COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', users_events.userId,
                'reltype', users_events.reltype
            )
        ), JSON_ARRAY())
    ) AS event,
    JSON_OBJECT(
        'name', COALESCE(locations.name, ''),
        'userInteractions', COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', users_locations.userId,
                'reltype', users_locations.reltype
            )
        ), JSON_ARRAY())
    ) AS location
FROM users_notifications
LEFT JOIN events ON (users_notifications.itemId = events.id AND users_notifications.itemType = 'event')
LEFT JOIN users_events ON (users_events.eventId = events.id AND users_notifications.itemType = 'event')
LEFT JOIN locations ON (users_notifications.itemId = locations.id AND users_notifications.itemType = 'location')
LEFT JOIN users_locations ON ((users_locations.locationId = locations.id AND users_notifications.itemType = 'location') OR events.locationId = locations.id)
JOIN users ON users_notifications.fromUserId = users.id
WHERE users_notifications.forUserId = 30
GROUP BY
    users_notifications.id,
    users.uname,
    users.role,
    events.name,
    events.privateev,
    events.dateStart,
    events.status,
    events.duration,
    events.locationId,
    events.msuggestions,
    events.genreVote,
    locations.name
ORDER BY users_notifications.id DESC;

    `
    let [notifications] = await db.execute(sql)

    const res = notifications.map((notif: any) => {
        let processedNotif = notif
        if (notif.itemType == 'event') {
            processedNotif = { ...processedNotif, event: Events.process(notif.event, uid), location: null }
        } else if (notif.itemType == 'location') {
            processedNotif = { ...processedNotif, location: Location.getPermissionFor(notif.location, uid), event: null }
        }
        return processedNotif
    })
    return NextResponse.json(res);
}