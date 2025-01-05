export interface PlayerProfile {
  id: string;
  region: string;
  languages: string[];
  timezone: string;
  experience: number;
  playStyle: 'casual' | 'moderate' | 'hardcore';
  preferredRoles: ('tank' | 'healer' | 'dps' | 'support')[];
  availability: {
    days: number[];  // 0-6 for Sunday-Saturday
    timeRanges: { start: number; end: number }[]; // 24-hour format
  };
  ratings: {
    overall: number;
    teamwork: number;
    communication: number;
    reliability: number;
  };
  history: {
    totalGames: number;
    completionRate: number;
    averageSessionLength: number;
  };
}

export class AdvancedMatchmaking {
  private static instance: AdvancedMatchmaking;
  private players: Map<string, PlayerProfile> = new Map();
  private activeMatches: Map<string, string[]> = new Map();
  private waitingPool: Set<string> = new Set();
  private matchQuality: Map<string, Map<string, number>> = new Map();

  static getInstance() {
    if (!AdvancedMatchmaking.instance) {
      AdvancedMatchmaking.instance = new AdvancedMatchmaking();
    }
    return AdvancedMatchmaking.instance;
  }

  addToQueue(playerId: string, profile: PlayerProfile) {
    this.players.set(playerId, profile);
    this.waitingPool.add(playerId);
    this.updateMatchQualities(playerId);
  }

  private updateMatchQualities(newPlayerId: string) {
    const newPlayer = this.players.get(newPlayerId);
    if (!newPlayer) return;

    if (!this.matchQuality.has(newPlayerId)) {
      this.matchQuality.set(newPlayerId, new Map());
    }

    // Calculate match quality with all other waiting players
    for (const otherId of this.waitingPool) {
      if (otherId === newPlayerId) continue;

      const otherPlayer = this.players.get(otherId);
      if (!otherPlayer) continue;

      const quality = this.calculateMatchQuality(newPlayer, otherPlayer);
      this.matchQuality.get(newPlayerId)?.set(otherId, quality);
      this.matchQuality.get(otherId)?.set(newPlayerId, quality);
    }
  }

  protected calculateMatchQuality(player1: PlayerProfile, player2: PlayerProfile): number {
    let score = 0;
    const weights = {
      region: 0.2,
      language: 0.15,
      timezone: 0.15,
      experience: 0.1,
      playStyle: 0.1,
      roleComplement: 0.1,
      availability: 0.1,
      ratings: 0.1
    };

    // Region matching
    score += weights.region * (player1.region === player2.region ? 1 : 0);

    // Language matching
    const commonLanguages = player1.languages.filter(lang => 
      player2.languages.includes(lang)
    ).length;
    score += weights.language * (commonLanguages > 0 ? 1 : 0);

    // Timezone compatibility
    const timezoneDiff = Math.abs(
      parseInt(player1.timezone) - parseInt(player2.timezone)
    );
    score += weights.timezone * (1 - Math.min(timezoneDiff / 12, 1));

    // Experience level matching
    const expDiff = Math.abs(player1.experience - player2.experience);
    score += weights.experience * (1 - Math.min(expDiff / 100, 1));

    // Play style compatibility
    score += weights.playStyle * (player1.playStyle === player2.playStyle ? 1 : 0.5);

    // Role complementarity
    const roleComplement = this.calculateRoleComplement(
      player1.preferredRoles,
      player2.preferredRoles
    );
    score += weights.roleComplement * roleComplement;

    // Availability overlap
    const availabilityMatch = this.calculateAvailabilityOverlap(
      player1.availability,
      player2.availability
    );
    score += weights.availability * availabilityMatch;

    // Ratings compatibility
    const ratingMatch = this.calculateRatingCompatibility(
      player1.ratings,
      player2.ratings
    );
    score += weights.ratings * ratingMatch;

    return score;
  }

  private calculateRoleComplement(
    roles1: ('tank' | 'healer' | 'dps' | 'support')[],
    roles2: ('tank' | 'healer' | 'dps' | 'support')[]
  ): number {
    const uniqueRoles = new Set([...roles1, ...roles2]);
    const hasEssentialRoles = 
      (roles1.includes('tank') || roles2.includes('tank')) &&
      (roles1.includes('healer') || roles2.includes('healer'));
    
    return hasEssentialRoles ? 1 : uniqueRoles.size / 4;
  }

  private calculateAvailabilityOverlap(
    avail1: PlayerProfile['availability'],
    avail2: PlayerProfile['availability']
  ): number {
    const commonDays = avail1.days.filter(day => 
      avail2.days.includes(day)
    ).length;

    const timeOverlap = avail1.timeRanges.some(range1 =>
      avail2.timeRanges.some(range2 =>
        range1.start < range2.end && range2.start < range1.end
      )
    );

    return (commonDays / 7 + (timeOverlap ? 1 : 0)) / 2;
  }

  private calculateRatingCompatibility(
    ratings1: PlayerProfile['ratings'],
    ratings2: PlayerProfile['ratings']
  ): number {
    const maxDiff = 2;
    const diffs = Object.keys(ratings1).map(key => 
      Math.abs(ratings1[key as keyof typeof ratings1] - ratings2[key as keyof typeof ratings2])
    );
    
    return 1 - (Math.max(...diffs) / maxDiff);
  }

  findOptimalMatches(): string[][] {
    const matches: string[][] = [];
    const targetGroupSize = 4; // Configurable group size

    while (this.waitingPool.size >= targetGroupSize) {
      const group = this.findBestGroup(targetGroupSize);
      if (!group) break;

      matches.push(group);
      group.forEach(id => this.waitingPool.delete(id));
    }

    return matches;
  }

  private findBestGroup(size: number): string[] | null {
    if (this.waitingPool.size < size) return null;

    let bestGroup: string[] | null = null;
    let bestScore = -1;

    // Use a sliding window approach to find the best group
    const candidates = Array.from(this.waitingPool);
    for (let i = 0; i <= candidates.length - size; i++) {
      const group = candidates.slice(i, i + size);
      const score = this.calculateGroupCompatibility(group);
      
      if (score > bestScore) {
        bestScore = score;
        bestGroup = group;
      }
    }

    return bestScore > 0.6 ? bestGroup : null; // Minimum quality threshold
  }

  private calculateGroupCompatibility(group: string[]): number {
    let totalScore = 0;
    let pairs = 0;

    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const quality = this.matchQuality.get(group[i])?.get(group[j]) ?? 0;
        totalScore += quality;
        pairs++;
      }
    }

    return totalScore / pairs;
  }
}