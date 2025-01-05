interface Region {
     code: string;
     name: string;
     languages: string[];
     timezone: string;
   }
   
   interface MatchPreferences {
     region: string;
     languages: string[];
     timezone: string;
     maxPing: number;
   }
   
   export class RegionalMatchmaking {
     private static instance: RegionalMatchmaking;
     private regions: Map<string, Region> = new Map();
     private playerPreferences: Map<string, MatchPreferences> = new Map();
     private activeMatches: Map<string, Set<string>> = new Map(); // region -> playerIds
   
     static getInstance() {
       if (!RegionalMatchmaking.instance) {
         RegionalMatchmaking.instance = new RegionalMatchmaking();
       }
       return RegionalMatchmaking.instance;
     }
   
     setPlayerPreferences(playerId: string, preferences: MatchPreferences) {
       this.playerPreferences.set(playerId, preferences);
     }
   
     findMatch(playerId: string): string[] {
       const preferences = this.playerPreferences.get(playerId);
       if (!preferences) return [];
   
       const potentialMatches = Array.from(this.playerPreferences.entries())
         .filter(([id, prefs]) => {
           if (id === playerId) return false;
   
           // Check region compatibility
           const regionMatch = prefs.region === preferences.region;
           
           // Check language compatibility (at least one common language)
           const languageMatch = prefs.languages.some(lang => 
             preferences.languages.includes(lang)
           );
   
           // Check timezone compatibility (within 3 hours)
           const timezoneDiff = Math.abs(
             parseInt(prefs.timezone) - parseInt(preferences.timezone)
           );
           const timezoneMatch = timezoneDiff <= 3;
   
           return regionMatch && languageMatch && timezoneMatch;
         })
         .map(([id]) => id);
   
       return potentialMatches;
     }
   
     createRegionalSession(players: string[], region: string) {
       if (!this.activeMatches.has(region)) {
         this.activeMatches.set(region, new Set());
       }
       
       players.forEach(playerId => {
         this.activeMatches.get(region)?.add(playerId);
       });
   
       // Return session details
       return {
         region,
         players,
         timestamp: Date.now(),
         server: this.getOptimalServer(region)
       };
     }
   
     private getOptimalServer(region: string): string {
       // Server selection logic based on region
       const servers: Record<string, string[]> = {
         'NA': ['us-east', 'us-west'],
         'EU': ['eu-central', 'eu-west'],
         'ASIA': ['asia-east', 'asia-southeast']
       };
   
       const regionalServers = servers[region] || servers['NA'];
       return regionalServers[0]; // Select first server as default
     }
   }