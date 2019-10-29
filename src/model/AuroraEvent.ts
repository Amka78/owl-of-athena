/*package org.iwinks.aurora.models

import androidx.room.*
import androidx.room.ForeignKey.CASCADE
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import org.iwinks.aurora.network.UnixTimestamp
import java.util.* */

//TODO: OK so this is NOT an immutable class like it should be
//but it's the only way to get it to work as both a moshi adapter and
//room entity. This is probably why most people suggest maintaining two
//separate classes...

/*@Entity(
        tableName = "aurora_events",
        primaryKeys = ["id","query_key"],
        indices = [Index("session_id")],
        foreignKeys = [
                ForeignKey(
                        entity = AuroraSession::class,
                        parentColumns = ["id"],
                        childColumns = ["session_id"],
                        onDelete = CASCADE
                )
        ]
)*/
//@JsonClass(generateAdapter = true)
export class AuroraEvent {

    constructor() {
        this.id = 0;
        this.sessionId = "";
        this.queryKey = "";
        this.flags = 0;
        this.auroraEventId = 0;
        this.bins = new Map<number, number>();
    }

    //@ColumnInfo(name = "id")
    //@Json(name = "id")
    //var id: Int = 0,
    public id: number;

    //this is not returned by the API (even though it should be)
    //but it will get updated before insertion into the
    //local db
    // @ColumnInfo(name = "session_id")
    // var sessionId: String = "",
    public sessionId: string;

    //this is a special field used for local DB storage
    //that won't get returned by the API so it will
    //get updated later
    //@ColumnInfo(name = "query_key")
    //var queryKey: String = "",
    public queryKey: string;

    //this too gets reassigned before DB insertion
    //@ColumnInfo(name = "flags")
    //@Json(name = "flags")
    //var flags: Float = 0f,
    public flags: number;

    //@ColumnInfo(name = "aurora_event_id")
    //@Json(name = "aurora_event_id")
    //var auroraEventId: Int = 0,
    public auroraEventId: number;

    //we don't store this one in the local DB
    //instead we update the flags before insertion
    //and use "query_key" to remember the bin parameter
    //@Json(name = "bins")
    //@Ignore
    //var bins: Map<Int, Float>?= null,
    public bins: Map<number, number>;

    /*@UnixTimestamp
    @ColumnInfo(name = "event_at")
    @Json(name = "event_at")*/
    public eventAt?: Date;
}
