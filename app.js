interface SessionDetails {
    logged_in: Date;
    logged_out?: Date;
    lastSeenAt: Date;
    deviceDetails: string;

interface UserSessions {
    [userId: string]: SessionDetails[];
}

class SessionManager {
    private userSessions: UserSessions = {};

    public logIn(userId: string, loggedIn: Date, lastSeenAt: Date, deviceDetails: string): void {
        if (!this.userSessions[userId]) {
            this.userSessions[userId] = [];
        }
        this.userSessions[userId].push({ logged_in: loggedIn, lastSeenAt: lastSeenAt, deviceDetails: deviceDetails });
    }

    public logOut(userId: string, loggedOut: Date): void {
        if (this.userSessions[userId]) {
            const currentSession = this.userSessions[userId].slice(-1)[0];
            if (currentSession) {
                currentSession.logged_out = loggedOut;
            }
        }
    }

    public getSessionDuration(userId: string): number {
        if (this.userSessions[userId]) {
            let totalDuration = 0;
            for (const session of this.userSessions[userId]) {
                const logoutTime = session.logged_out ? session.logged_out : new Date();
                totalDuration += logoutTime.getTime() - session.logged_in.getTime();
            }
            return totalDuration;
        }
        return 0;
    }

    public getActiveUsers(): string[] {
        const activeUsers: string[] = [];
        for (const userId in this.userSessions) {
            if (this.userSessions.hasOwnProperty(userId)) {
                const sessions = this.userSessions[userId];
                if (sessions.length > 0 && !sessions[sessions.length - 1].logged_out) {
                    activeUsers.push(userId);
                }
            }
        }
        return activeUsers;
    }
}

// Example usage:
const sessionManager = new SessionManager();

// User "user1" logs in
sessionManager.logIn("user1", new Date("2024-03-26T10:00:00"), new Date("2024-03-26T10:00:00"), "Device1");

// User "user1" logs out after some time
sessionManager.logOut("user1", new Date("2024-03-26T12:00:00"));

// User "user1" logs in again from another device
sessionManager.logIn("user1", new Date("2024-03-26T15:00:00"), new Date("2024-03-26T15:00:00"), "Device2");

// Get total session duration for "user1"
console.log("Total session duration for user1:", sessionManager.getSessionDuration("user1"));

// Get active users
console.log("Active users:", sessionManager.getActiveUsers());